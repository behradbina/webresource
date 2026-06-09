package com.example.webresource.service;

import com.example.webresource.dto.ArticleRequest;
import com.example.webresource.dto.ArticleResponse;
import com.example.webresource.model.Article;
import com.example.webresource.repository.ArticleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ArticleService {

    private final ArticleRepository articleRepository;

    public ArticleService(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    // ==================== READ OPERATIONS ====================

    public List<ArticleResponse> getAll(String q, String sort) {
        List<Article> articles;

        // Filtering
        if (q != null && !q.isBlank()) {
            String query = q.toLowerCase();
            articles = articleRepository.findByTitleContainingIgnoreCaseOrSummaryContainingIgnoreCase(query, query);
        } else {
            articles = articleRepository.findAll();
        }

        // Sorting
        if ("date".equals(sort)) {
            articles.sort((a, b) -> b.getPublishTime().compareTo(a.getPublishTime()));
        } else {
            // Sort by reference count (popularity)
            articles.sort((a, b) -> Long.compare(
                    articleRepository.countReferrersByTitle(b.getTitle()),
                    articleRepository.countReferrersByTitle(a.getTitle())
            ));
        }

        return articles.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ArticleResponse getOne(String title) {
        return articleRepository.findByTitle(title)
                .map(this::toResponse)
                .orElse(null);
    }

    public List<ArticleResponse> getReferrers(String title) {
        return articleRepository.findReferrersByTitle(title).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ==================== WRITE OPERATIONS ====================

    @Transactional
    public ArticleResponse create(ArticleRequest req) {
        // Resolve references from titles to actual Article entities
        List<Article> referencedArticles = req.refs != null ?
                req.refs.stream()
                        .map(articleRepository::findByTitle)
                        .filter(java.util.Optional::isPresent)
                        .map(java.util.Optional::get)
                        .collect(Collectors.toList()) :
                List.of();

        Article article = new Article(req.title, req.summary, req.body, referencedArticles);
        Article saved = articleRepository.save(article);
        return toResponse(saved);
    }

    @Transactional
    public void delete(String title) {
        articleRepository.deleteById(title);
    }

    // ==================== HELPER METHODS ====================

    public boolean exists(String title) {
        return articleRepository.existsByTitle(title);
    }

    public long refCount(String title) {
        return articleRepository.countReferrersByTitle(title);
    }

    private ArticleResponse toResponse(Article article) {
        List<String> refTitles = article.getRefs().stream()
                .map(Article::getTitle)
                .collect(Collectors.toList());

        long referrerCount = articleRepository.countReferrersByTitle(article.getTitle());

        return new ArticleResponse(
                article.getTitle(),
                article.getSummary(),
                article.getBody(),
                article.getPublishTime(),
                refTitles,
                referrerCount
        );
    }
}