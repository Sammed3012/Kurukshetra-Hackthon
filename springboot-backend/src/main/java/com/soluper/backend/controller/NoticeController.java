package com.soluper.backend.controller;

import com.soluper.backend.dto.ApiResponse;
import com.soluper.backend.model.Notice;
import com.soluper.backend.service.NoticeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notices")
@CrossOrigin(origins = "*")
public class NoticeController {

    private final NoticeService noticeService;

    public NoticeController(NoticeService noticeService) {
        this.noticeService = noticeService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Notice>>> getAll(@RequestParam(required = false) String type) {
        return ResponseEntity.ok(ApiResponse.ok("Retrieved notices", noticeService.getAll(type)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Notice>> create(@RequestBody Notice notice) {
        return ResponseEntity.ok(ApiResponse.ok("Notice published", noticeService.create(notice)));
    }
}
