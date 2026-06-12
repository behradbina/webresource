package com.example.webresource.repository;

import com.example.webresource.model.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ArticleRepository extends JpaRepository<Article, Long> {

    Optional<Article> findByTitle(String title);

    boolean existsByTitle(String title);

    List<Article> findByTitleContainingIgnoreCaseOrSummaryContainingIgnoreCase(
            String title,
            String summary
    );

    @Query("""
        SELECT COUNT(a)
        FROM Article a
        JOIN a.refs r
        WHERE r.title = :title
    """)
    long countReferrersByTitle(String title);

    @Query("""
        SELECT a
        FROM Article a
        JOIN a.refs r
        WHERE r.title = :title
    """)
    List<Article> findReferrersByTitle(String title);
}