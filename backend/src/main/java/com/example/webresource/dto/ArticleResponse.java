package com.example.webresource.dto;

import java.time.Instant;
import java.util.List;

public class ArticleResponse {
    public String title;
    public String summary;
    public String body;
    public Instant publishTime;
    public List<String> refs;
    public long referrerCount;

    public ArticleResponse(String title, String summary, String body,
                           Instant publishTime, List<String> refs, long referrerCount) {
        this.title = title;
        this.summary = summary;
        this.body = body;
        this.publishTime = publishTime;
        this.refs = refs;
        this.referrerCount = referrerCount;
    }
}