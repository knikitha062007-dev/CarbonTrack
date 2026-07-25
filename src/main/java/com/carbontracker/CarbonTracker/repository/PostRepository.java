package com.carbontracker.CarbonTracker.repository;

import com.carbontracker.CarbonTracker.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    @Query("SELECT p FROM Post p JOIN FETCH p.user u " +
           "WHERE (:postType IS NULL OR p.postType = :postType) " +
           "AND (:search IS NULL OR LOWER(u.fullName) LIKE :search) " +
           "ORDER BY p.createdAt DESC")
    List<Post> findFeed(@Param("postType") String postType, @Param("search") String search);

    List<Post> findTop5BySharedBadgeNameIsNotNullOrderByCreatedAtDesc();
}
