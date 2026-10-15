package com.soluper.backend.service;

import com.soluper.backend.model.Notice;
import com.soluper.backend.repository.NoticeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoticeService {

    private final NoticeRepository noticeRepository;

    public NoticeService(NoticeRepository noticeRepository) {
        this.noticeRepository = noticeRepository;
    }

    public List<Notice> getAll(String type) {
        if (type != null && !type.trim().isEmpty()) {
            return noticeRepository.findByTypeIgnoreCase(type.trim());
        }
        return noticeRepository.findAll();
    }

    public Notice create(Notice notice) {
        return noticeRepository.save(notice);
    }
}
