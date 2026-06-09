package com.example.webresource.repository;

import com.example.webresource.model.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArticleRepository extends JpaRepository<Article, String>, JpaSpecificationExecutor<Article> {

    // Spring Data Query Method - finds by title containing query (case-insensitive)
    List<Article> findByTitleContainingIgnoreCaseOrSummaryContainingIgnoreCase(String title, String summary);

    // Custom JPQL query to count references to a specific article
    @Query("SELECT COUNT(a) FROM Article a JOIN a.refs r WHERE r.title = :title")
    long countReferrersByTitle(@Param("title") String title);

    // Find all articles that reference a specific article
    @Query("SELECT a FROM Article a JOIN a.refs r WHERE r.title = :title")
    List<Article> findReferrersByTitle(@Param("title") String title);

    // Check if article exists by title
    boolean existsByTitle(String title);

    // Find by title (returns Optional for null safety)
    Optional<Article> findByTitle(String title);
}