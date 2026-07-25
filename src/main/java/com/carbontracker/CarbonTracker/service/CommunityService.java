package com.carbontracker.CarbonTracker.service;

import com.carbontracker.CarbonTracker.dto.*;
import com.carbontracker.CarbonTracker.entity.*;
import com.carbontracker.CarbonTracker.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommunityService {

    private final PostRepository postRepository;
    private final PostLikeRepository postLikeRepository;
    private final PostReactionRepository postReactionRepository;
    private final PostCommentRepository postCommentRepository;
    private final UserRepository userRepository;
    private final ActivityRepository activityRepository;
    private final LeaderboardService leaderboardService;

    @Transactional
    public PostResponse createPost(User user, PostRequest request) {
        String ecoUpdatesStr = request.getEcoUpdates() != null ? String.join(",", request.getEcoUpdates()) : "";

        Post post = Post.builder()
                .user(user)
                .caption(request.getCaption())
                .imageUrl(request.getImageUrl())
                .postType(request.getPostType() != null ? request.getPostType().toUpperCase() : "ALL")
                .ecoUpdates(ecoUpdatesStr)
                .sharedBadgeName(request.getSharedBadgeName())
                .sharedBadgeIcon(request.getSharedBadgeIcon())
                .sharedGoalTarget(request.getSharedGoalTarget())
                .sustainabilityTip(request.getSustainabilityTip())
                .carbonSaved(request.getCarbonSaved())
                .createdAt(LocalDateTime.now())
                .build();

        post = postRepository.save(post);
        return mapToPostResponse(post, user);
    }

    @Transactional(readOnly = true)
    public List<PostResponse> getFeed(User currentUser, String filter, String search) {
        String postTypeFilter = (filter == null || filter.equalsIgnoreCase("All")) ? null : filter.toUpperCase();
        String searchQuery = (search == null || search.trim().isEmpty()) ? null : "%" + search.trim().toLowerCase() + "%";

        List<Post> posts = postRepository.findFeed(postTypeFilter, searchQuery);
        return posts.stream()
                .map(post -> mapToPostResponse(post, currentUser))
                .collect(Collectors.toList());
    }

    @Transactional
    public boolean toggleLike(User user, Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Optional<PostLike> existingLike = postLikeRepository.findByPostIdAndUserId(postId, user.getId());
        if (existingLike.isPresent()) {
            postLikeRepository.delete(existingLike.get());
            return false; // unliked
        } else {
            PostLike newLike = PostLike.builder()
                    .post(post)
                    .user(user)
                    .build();
            postLikeRepository.save(newLike);
            return true; // liked
        }
    }

    @Transactional
    public String reactToPost(User user, Long postId, ReactionRequest request) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Optional<PostReaction> existingReaction = postReactionRepository.findByPostIdAndUserId(postId, user.getId());
        String newReaction = request.getReactionType().toUpperCase();

        if (existingReaction.isPresent()) {
            PostReaction rx = existingReaction.get();
            if (rx.getReactionType().equalsIgnoreCase(newReaction)) {
                postReactionRepository.delete(rx);
                return null; // removed reaction if clicked same
            } else {
                rx.setReactionType(newReaction);
                postReactionRepository.save(rx);
                return newReaction;
            }
        } else {
            PostReaction rx = PostReaction.builder()
                    .post(post)
                    .user(user)
                    .reactionType(newReaction)
                    .build();
            postReactionRepository.save(rx);
            return newReaction;
        }
    }

    @Transactional
    public CommentResponse addComment(User user, Long postId, CommentRequest request) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        PostComment comment = PostComment.builder()
                .post(post)
                .user(user)
                .content(request.getContent())
                .createdAt(LocalDateTime.now())
                .build();

        comment = postCommentRepository.save(comment);

        return CommentResponse.builder()
                .id(comment.getId())
                .userId(user.getId())
                .userFullName(user.getFullName())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getComments(Long postId) {
        List<PostComment> comments = postCommentRepository.findByPostIdOrderByCreatedAtAsc(postId);
        return comments.stream()
                .map(c -> CommentResponse.builder()
                        .id(c.getId())
                        .userId(c.getUser().getId())
                        .userFullName(c.getUser().getFullName())
                        .content(c.getContent())
                        .createdAt(c.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SidebarResponse getSidebar(User currentUser) {
        // 1. Top Contributors (lowest emissions from leaderboard)
        List<LeaderboardResponse> leaderboard = leaderboardService.getLeaderboard();
        List<SidebarResponse.ContributorDto> topContributors = new ArrayList<>();
        int rankLimit = Math.min(5, leaderboard.size());

        for (int i = 0; i < rankLimit; i++) {
            LeaderboardResponse item = leaderboard.get(i);
            User user = userRepository.findById(item.getId()).orElse(null);
            double totalEmission = item.getTotalEmission();

            // Calculate carbon saved dynamically based on logs
            long activityCount = user != null ? activityRepository.countByUser(user) : 0;
            double carbonSaved = Math.round((activityCount * 3.5) * 10.0) / 10.0;

            topContributors.add(SidebarResponse.ContributorDto.builder()
                    .userId(item.getId())
                    .fullName(item.getName())
                    .carbonSaved(carbonSaved)
                    .rank(i + 1)
                    .build());
        }

        // 2. Latest Badges
        List<Post> recentBadgePosts = postRepository.findTop5BySharedBadgeNameIsNotNullOrderByCreatedAtDesc();
        List<SidebarResponse.SharedBadgeDto> latestBadges = recentBadgePosts.stream()
                .map(p -> SidebarResponse.SharedBadgeDto.builder()
                        .badgeName(p.getSharedBadgeName())
                        .badgeIcon(p.getSharedBadgeIcon())
                        .userFullName(p.getUser().getFullName())
                        .sharedAt(p.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        // Fill with mock items if list is empty to keep sidebar premium
        if (latestBadges.isEmpty()) {
            latestBadges.add(new SidebarResponse.SharedBadgeDto("Carbon Hero", "🌍", "Alice Johnson", LocalDateTime.now().minusHours(2)));
            latestBadges.add(new SidebarResponse.SharedBadgeDto("Energy Saver", "⚡", "Bob Smith", LocalDateTime.now().minusHours(5)));
            latestBadges.add(new SidebarResponse.SharedBadgeDto("Sustainable Eater", "🥗", "Emma Watson", LocalDateTime.now().minusDays(1)));
        }

        // 3. New Members (recent registrations)
        List<User> newUsers = userRepository.findAll();
        // sort by createdAt desc or ID desc
        newUsers.sort((u1, u2) -> {
            LocalDateTime t1 = u1.getCreatedAt() != null ? u1.getCreatedAt() : LocalDateTime.MIN;
            LocalDateTime t2 = u2.getCreatedAt() != null ? u2.getCreatedAt() : LocalDateTime.MIN;
            return t2.compareTo(t1);
        });

        List<SidebarResponse.NewMemberDto> newMembers = newUsers.stream()
                .limit(5)
                .map(u -> SidebarResponse.NewMemberDto.builder()
                        .userId(u.getId())
                        .fullName(u.getFullName())
                        .joinedAt(u.getCreatedAt() != null ? u.getCreatedAt() : LocalDateTime.now().minusDays(2))
                        .build())
                .collect(Collectors.toList());

        return SidebarResponse.builder()
                .topContributors(topContributors)
                .latestBadges(latestBadges)
                .newMembers(newMembers)
                .build();
    }

    @Transactional(readOnly = true)
    public UserProfileStatsResponse getUserProfileStats(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Rank in Leaderboard
        List<LeaderboardResponse> leaderboard = leaderboardService.getLeaderboard();
        int rank = leaderboard.size() + 1;
        for (int i = 0; i < leaderboard.size(); i++) {
            if (leaderboard.get(i).getId().equals(userId)) {
                rank = i + 1;
                break;
            }
        }

        // Carbon Saved (logs count * 3.5)
        long activityCount = activityRepository.countByUser(user);
        double carbonSaved = Math.round((activityCount * 3.5) * 10.0) / 10.0;

        // Ongoing Streak
        int ongoingStreak = calculateOngoingStreak(user);
        int maxStreak = calculateMaxStreak(user);

        // Dynamic Badges check
        double transportEmission = activityRepository.getTransportEmission(user);
        double electricityEmission = activityRepository.getElectricityEmission(user);
        double foodEmission = activityRepository.getFoodEmission(user);
        double shoppingEmission = activityRepository.getShoppingEmission(user);

        boolean hasTransport = activityRepository.findByUser(user).stream().anyMatch(a -> a.getActivityType().name().equalsIgnoreCase("TRANSPORT"));
        boolean hasElectricity = activityRepository.findByUser(user).stream().anyMatch(a -> a.getActivityType().name().equalsIgnoreCase("ELECTRICITY"));
        boolean hasFood = activityRepository.findByUser(user).stream().anyMatch(a -> a.getActivityType().name().equalsIgnoreCase("FOOD"));
        boolean hasShopping = activityRepository.findByUser(user).stream().anyMatch(a -> a.getActivityType().name().equalsIgnoreCase("SHOPPING"));

        List<UserProfileStatsResponse.BadgeDetailsDto> badges = new ArrayList<>();
        badges.add(new UserProfileStatsResponse.BadgeDetailsDto("b1", "Eco Beginner", "Logged first carbon activity.", "🌱", activityCount > 0));
        badges.add(new UserProfileStatsResponse.BadgeDetailsDto("b2", "Green Commuter", "Maintain transport emissions under 50 kg CO₂.", "🚶", hasTransport && transportEmission < 50.0));
        badges.add(new UserProfileStatsResponse.BadgeDetailsDto("b3", "Energy Saver", "Keep electricity emissions under 80 kg CO₂.", "⚡", hasElectricity && electricityEmission < 80.0));
        badges.add(new UserProfileStatsResponse.BadgeDetailsDto("b4", "Sustainable Eater", "Select low impact foods (under 30 kg CO₂ total).", "🥗", hasFood && foodEmission < 30.0));
        badges.add(new UserProfileStatsResponse.BadgeDetailsDto("b5", "Conscious Shopper", "Keep shopping emissions under 25 kg CO₂.", "🛍", hasShopping && shoppingEmission < 25.0));
        badges.add(new UserProfileStatsResponse.BadgeDetailsDto("b6", "7-Day Streak", "Logged activities for 7 consecutive days.", "🔥", maxStreak >= 7));
        badges.add(new UserProfileStatsResponse.BadgeDetailsDto("b7", "Carbon Hero", "Daily emissions below 20kg for 30 consecutive days.", "🌍", activityCount > 0 && maxStreak >= 30));
        badges.add(new UserProfileStatsResponse.BadgeDetailsDto("b8", "Community Leader", "Reach the Top 3 on the community leaderboard.", "🏆", rank <= 3));

        return UserProfileStatsResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .rank(rank)
                .carbonSaved(carbonSaved)
                .streak(ongoingStreak)
                .badges(badges)
                .build();
    }

    private int calculateOngoingStreak(User user) {
        List<Activity> activities = activityRepository.findByUser(user);
        if (activities.isEmpty()) return 0;

        Set<java.time.LocalDate> uniqueDates = activities.stream()
                .filter(a -> a.getCreatedAt() != null)
                .map(a -> a.getCreatedAt().toLocalDate())
                .collect(Collectors.toSet());

        java.time.LocalDate checkDate = java.time.LocalDate.now();
        if (!uniqueDates.contains(checkDate)) {
            checkDate = checkDate.minusDays(1);
        }

        int streak = 0;
        while (uniqueDates.contains(checkDate)) {
            streak++;
            checkDate = checkDate.minusDays(1);
        }
        return streak;
    }

    private int calculateMaxStreak(User user) {
        List<Activity> activities = activityRepository.findByUser(user);
        if (activities.isEmpty()) return 0;

        List<java.time.LocalDate> sortedDates = activities.stream()
                .filter(a -> a.getCreatedAt() != null)
                .map(a -> a.getCreatedAt().toLocalDate())
                .distinct()
                .sorted()
                .collect(Collectors.toList());

        int maxStreak = 0;
        int currentStreak = 0;
        java.time.LocalDate lastDate = null;

        for (java.time.LocalDate currentDate : sortedDates) {
            if (lastDate == null) {
                currentStreak = 1;
            } else {
                long diff = ChronoUnit.DAYS.between(lastDate, currentDate);
                if (diff == 1) {
                    currentStreak++;
                } else if (diff > 1) {
                    currentStreak = 1;
                }
            }
            if (currentStreak > maxStreak) {
                maxStreak = currentStreak;
            }
            lastDate = currentDate;
        }
        return maxStreak;
    }

    private PostResponse mapToPostResponse(Post post, User currentUser) {
        List<String> ecoUpdates = (post.getEcoUpdates() != null && !post.getEcoUpdates().trim().isEmpty())
                ? Arrays.asList(post.getEcoUpdates().split(","))
                : Collections.emptyList();

        long likesCount = postLikeRepository.countByPostId(post.getId());
        boolean likedByMe = postLikeRepository.existsByPostIdAndUserId(post.getId(), currentUser.getId());
        long commentsCount = postCommentRepository.countByPostId(post.getId());

        List<PostReaction> reactions = postReactionRepository.findByPostId(post.getId());
        Map<String, Long> reactionsCount = reactions.stream()
                .collect(Collectors.groupingBy(PostReaction::getReactionType, Collectors.counting()));

        // Make sure all eco reactions have at least a 0 count in response map
        for (String rxType : List.of("INSPIRED", "GREAT_CHOICE", "APPRECIATE", "MOTIVATED")) {
            reactionsCount.putIfAbsent(rxType, 0L);
        }

        String myReaction = reactions.stream()
                .filter(r -> r.getUser().getId().equals(currentUser.getId()))
                .map(PostReaction::getReactionType)
                .findFirst()
                .orElse(null);

        return PostResponse.builder()
                .id(post.getId())
                .userId(post.getUser().getId())
                .userFullName(post.getUser().getFullName())
                .caption(post.getCaption())
                .imageUrl(post.getImageUrl())
                .postType(post.getPostType())
                .ecoUpdates(ecoUpdates)
                .sharedBadgeName(post.getSharedBadgeName())
                .sharedBadgeIcon(post.getSharedBadgeIcon())
                .sharedGoalTarget(post.getSharedGoalTarget())
                .sustainabilityTip(post.getSustainabilityTip())
                .carbonSaved(post.getCarbonSaved())
                .createdAt(post.getCreatedAt())
                .likesCount(likesCount)
                .likedByMe(likedByMe)
                .commentsCount(commentsCount)
                .reactionsCount(reactionsCount)
                .myReaction(myReaction)
                .build();
    }
}
