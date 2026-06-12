package com.example.webresource.dto;

import java.time.Instant;
import java.util.List;

public class ArticleResponse {

    public Long id;

    public String title;

    public String summary;

    public String body;

    public Instant publishTime;

    public List<String> refs;

    public long citationCount;

    public ArticleResponse(
            Long id,
            String title,
            String summary,
            String body,
            Instant publishTime,
            List<String> refs,
            long citationCount
    ) {
        this.id = id;
        this.title = title;
        this.summary = summary;
        this.body = body;
        this.publishTime = publishTime;
        this.refs = refs;
        this.citationCount = citationCount;
    }
}