package com.example.webresource.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "articles")
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 255)
    private String title;

    @Column(nullable = false, length = 1000)
    private String summary;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String body;

    // Fixed: Changed from 'long' back to 'Instant' to match our updated service & JPA mapping
    @Column(name = "publish_time", nullable = false)
    private Instant publishTime;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "article_references",
            joinColumns = @JoinColumn(name = "article_id"),
            inverseJoinColumns = @JoinColumn(name = "referenced_article_id")
    )
    private List<Article> refs = new ArrayList<>();

    @ManyToMany(mappedBy = "refs")
    private List<Article> referrers = new ArrayList<>();

    // Fixed: Added JPA mappings for author
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    protected Article() {}

    // Fixed: Standardized to use List<Article> refs and User author
    public Article(String title, String summary, String body, List<Article> refs, User author) {
        this.title = title;
        this.summary = summary;
        this.body = body;
        this.author = author;
        this.publishTime = Instant.now();

        if (refs != null) {
            this.refs = refs;
        }
    }

    // ================= GETTERS & SETTERS =================

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getSummary() {
        return summary;
    }

    public String getBody() {
        return body;
    }

    public Instant getPublishTime() {
        return publishTime;
    }

    public List<Article> getRefs() {
        return refs;
    }

    public List<Article> getReferrers() {
        return referrers;
    }

    public User getAuthor() {
        return author;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public void setPublishTime(Instant publishTime) {
        this.publishTime = publishTime;
    }

    public void setRefs(List<Article> refs) {
        this.refs = refs;
    }

    public void setReferrers(List<Article> referrers) {
        this.referrers = referrers;
    }

    public void setAuthor(User author) {
        this.author = author;
    }
}