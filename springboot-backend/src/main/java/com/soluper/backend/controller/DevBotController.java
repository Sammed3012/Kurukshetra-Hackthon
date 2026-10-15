package com.soluper.backend.controller;

import com.soluper.backend.dto.ApiResponse;
import com.soluper.backend.dto.ChatMessageRequest;
import com.soluper.backend.dto.ChatMessageResponse;
import com.soluper.backend.service.DevBotService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/devbot")
@CrossOrigin(origins = "*")
public class DevBotController {

    private final DevBotService devBotService;

    public DevBotController(DevBotService devBotService) {
        this.devBotService = devBotService;
    }

    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<ChatMessageResponse>> chat(@RequestBody ChatMessageRequest request) {
        String botReply = devBotService.generateBotResponse(request.getMessage(), request.getTheme());
        ChatMessageResponse response = new ChatMessageResponse(botReply);
        return ResponseEntity.ok(ApiResponse.ok("DevBot response ready", response));
    }
}
