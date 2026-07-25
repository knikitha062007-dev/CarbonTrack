package com.carbontracker.CarbonTracker.repository;

import com.carbontracker.CarbonTracker.entity.PostReaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PostReactionRepository extends JpaRepository<PostReaction, Long> {

    List<PostReaction> findByPostId(Long postId);

    Optional<PostReaction> findByPostIdAndUserId(Long postId, Long userId);
}
