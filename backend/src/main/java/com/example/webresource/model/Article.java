package com.example.webresource.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "articles")
public class Article {

    @Id
    @Column(name = "title", nullable = false, unique = true, length = 255)
    private String title;

    @Column(name = "summary", nullable = false, length = 1000)
    private String summary;

    @Column(name = "body", nullable = false, columnDefinition = "TEXT")
    private String body;

    @Column(name = "publish_time", nullable = false)
    private Instant publishTime;

    // Self-referencing many-to-many: Article A references Article B
    @ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "article_references",
            joinColumns = @JoinColumn(name = "article_title"),
            inverseJoinColumns = @JoinColumn(name = "referenced_article_title")
    )
    private List<Article> refs = new ArrayList<>();

    // Inverse side: articles that reference this article
    @ManyToMany(mappedBy = "refs", fetch = FetchType.LAZY)
    private List<Article> referrers = new ArrayList<>();

    // Required no-arg constructor for JPA
    protected Article() {}

    public Article(String title, String summary, String body, List<Article> refs) {
        this.title = title;
        this.summary = summary;
        this.body = body;
        this.publishTime = Instant.now();
        if (refs != null) {
            this.refs = refs;
        }
    }

    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }

    public Instant getPublishTime() { return publishTime; }
    public void setPublishTime(Instant publishTime) { this.publishTime = publishTime; }

    public List<Article> getRefs() { return refs; }
    public void setRefs(List<Article> refs) { this.refs = refs; }

    public List<Article> getReferrers() { return referrers; }
    public void setReferrers(List<Article> referrers) { this.referrers = referrers; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Article article = (Article) o;
        return title != null && title.equals(article.title);
    }

    @Override
    public int hashCode() {
        return title != null ? title.hashCode() : 0;
    }
}