package com.carbontracker.CarbonTracker.repository;

import com.carbontracker.CarbonTracker.entity.PostComment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PostCommentRepository extends JpaRepository<PostComment, Long> {

    long countByPostId(Long postId);

    List<PostComment> findByPostIdOrderByCreatedAtAsc(Long postId);
}
