package com.example.webresource.service;

import com.example.webresource.dto.ArticleRequest;
import com.example.webresource.dto.ArticleResponse;
import com.example.webresource.model.Article;
import com.example.webresource.model.User;
import com.example.webresource.repository.ArticleRepository;
import com.example.webresource.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ArticleService {

    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;

    public ArticleService(ArticleRepository articleRepository, UserRepository userRepository) {
        this.articleRepository = articleRepository;
        this.userRepository = userRepository;
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
    public ArticleResponse create(ArticleRequest req, String authorUsername) {
        User author = userRepository.findByUsername(authorUsername)
                .orElseThrow(() -> new RuntimeException("Author not found"));

        // Resolve references safely without ambiguous method references
        List<Article> referencedArticles = req.refs != null ?
                req.refs.stream()
                        .map(title -> articleRepository.findByTitle(title))
                        .filter(Optional::isPresent)
                        .map(Optional::get)
                        .collect(Collectors.toList()) :
                List.of();

        Article article = new Article(req.title, req.summary, req.body, referencedArticles, author);
        Article saved = articleRepository.save(article);
        return toResponse(saved);
    }

    @Transactional
    public void delete(String title) {
        articleRepository.findByTitle(title)
                .ifPresent(articleRepository::delete);
    }

    // ==================== HELPER METHODS ====================

    public boolean exists(String title) {
        return articleRepository.existsByTitle(title);
    }

    public long refCount(String title) {
        return articleRepository.countReferrersByTitle(title);
    }

    public boolean isAuthor(String title, String username) {
        Optional<Article> articleOpt = articleRepository.findByTitle(title);
        if (articleOpt.isEmpty()) {
            return false;
        }
        Article article = articleOpt.get();
        User author = article.getAuthor();
        return author != null && author.getUsername().equals(username);
    }

    private ArticleResponse toResponse(Article article) {
        List<String> refTitles = article.getRefs()
                .stream()
                .map(Article::getTitle)
                .toList();

        long referrerCount = articleRepository.countReferrersByTitle(article.getTitle());

        String authorUsername = article.getAuthor() != null ? article.getAuthor().getUsername() : "Anonymous";

        return new ArticleResponse(
                article.getId(),
                article.getTitle(),
                article.getSummary(),
                article.getBody(),
                article.getPublishTime(),
                refTitles,
                referrerCount,
                authorUsername
        );
    }


}