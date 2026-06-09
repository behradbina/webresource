package com.example.webresource.controller;

import com.example.webresource.dto.ArticleRequest;
import com.example.webresource.dto.ArticleResponse;
import com.example.webresource.service.ArticleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articles")
public class ArticleController {

    private final ArticleService service;

    public ArticleController(ArticleService service) {
        this.service = service;
    }

    // GET /api/articles?q=...&sort=...
    @GetMapping
    public List<ArticleResponse> getAll(
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "refs") String sort) {
        return service.getAll(q, sort);
    }

    // GET /api/articles/{title}
    @GetMapping("/{title}")
    public ResponseEntity<?> getOne(@PathVariable String title) {
        ArticleResponse a = service.getOne(title);
        if (a == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(a);
    }

    // POST /api/articles
    @PostMapping
    public ResponseEntity<?> create(@RequestBody ArticleRequest req) {
        if (service.exists(req.title)) {
            return ResponseEntity.status(409).body("Title must be unique");
        }

        if (req.refs != null && req.refs.contains(req.title)) {
            return ResponseEntity.status(422).body("Self reference not allowed");
        }


        ArticleResponse created = service.create(req);
        return ResponseEntity.status(201).body(created);
    }

    // DELETE /api/articles/{title}
    @DeleteMapping("/{title}")
    public ResponseEntity<?> delete(@PathVariable String title) {
        if (!service.exists(title)) {
            return ResponseEntity.notFound().build();
        }
        service.delete(title);
        return ResponseEntity.noContent().build();
    }

    // GET /api/articles/{title}/referrers
    @GetMapping("/{title}/referrers")
    public List<ArticleResponse> referrers(@PathVariable String title) {
        return service.getReferrers(title);
    }
}