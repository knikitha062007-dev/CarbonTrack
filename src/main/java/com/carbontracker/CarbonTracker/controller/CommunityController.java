package com.carbontracker.CarbonTracker.controller;

import com.carbontracker.CarbonTracker.dto.*;
import com.carbontracker.CarbonTracker.entity.User;
import com.carbontracker.CarbonTracker.service.CommunityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping
public class CommunityController {

    private final CommunityService communityService;

    @PostMapping("/community/posts")
    public PostResponse createPost(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody PostRequest request
    ) {
        return communityService.createPost(user, request);
    }

    @GetMapping("/community/posts")
    public List<PostResponse> getFeed(
            @AuthenticationPrincipal User user,
            @RequestParam(value = "filter", required = false) String filter,
            @RequestParam(value = "search", required = false) String search
    ) {
        return communityService.getFeed(user, filter, search);
    }

    @PostMapping("/community/posts/{id}/like")
    public Map<String, Boolean> toggleLike(
            @AuthenticationPrincipal User user,
            @PathVariable("id") Long postId
    ) {
        boolean liked = communityService.toggleLike(user, postId);
        return Map.of("liked", liked);
    }

    @PostMapping("/community/posts/{id}/react")
    public Map<String, String> react(
            @AuthenticationPrincipal User user,
            @PathVariable("id") Long postId,
            @Valid @RequestBody ReactionRequest request
    ) {
        String reaction = communityService.reactToPost(user, postId, request);
        return Map.of("reaction", reaction != null ? reaction : "");
    }

    @PostMapping("/community/posts/{id}/comments")
    public CommentResponse addComment(
            @AuthenticationPrincipal User user,
            @PathVariable("id") Long postId,
            @Valid @RequestBody CommentRequest request
    ) {
        return communityService.addComment(user, postId, request);
    }

    @GetMapping("/community/posts/{id}/comments")
    public List<CommentResponse> getComments(
            @PathVariable("id") Long postId
    ) {
        return communityService.getComments(postId);
    }

    @GetMapping("/community/sidebar")
    public SidebarResponse getSidebar(
            @AuthenticationPrincipal User user
    ) {
        return communityService.getSidebar(user);
    }

    @GetMapping("/users/{id}/profile-stats")
    public UserProfileStatsResponse getUserProfileStats(
            @PathVariable("id") Long userId
    ) {
        return communityService.getUserProfileStats(userId);
    }
}
