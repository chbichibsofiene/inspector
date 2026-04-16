package com.inspector.platform.controller;

import com.inspector.platform.dto.ApiResponse;
import com.inspector.platform.dto.ConversationDto;
import com.inspector.platform.dto.MessageDto;
import com.inspector.platform.entity.User;
import com.inspector.platform.repository.UserRepository;
import com.inspector.platform.service.FileStorageService;
import com.inspector.platform.service.MessengerService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessengerController {

    private final MessengerService messengerService;
    private final FileStorageService fileStorageService;
    private final UserRepository userRepository;

    @GetMapping("/conversations")
    public ResponseEntity<ApiResponse<List<ConversationDto>>> getConversations(Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        return ResponseEntity.ok(ApiResponse.ok("Conversations retrieved", messengerService.getConversations(userId)));
    }

    @GetMapping("/contacts")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getContacts(Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        return ResponseEntity.ok(ApiResponse.ok("Contacts retrieved", messengerService.getContacts(userId)));
    }

    @GetMapping("/conversations/{id}")
    public ResponseEntity<ApiResponse<List<MessageDto>>> getMessages(@PathVariable Long id, Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        return ResponseEntity.ok(ApiResponse.ok("Messages retrieved", messengerService.getMessages(id, userId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MessageDto>> sendMessage(@RequestBody Map<String, Object> request, Authentication authentication) {
        Long senderId = getCurrentUserId(authentication);
        Long recipientId = Long.valueOf(request.get("recipientId").toString());
        String content = request.getOrDefault("content", "").toString();
        String fileUrl = request.getOrDefault("fileUrl", null) != null ? request.get("fileUrl").toString() : null;
        String fileName = request.getOrDefault("fileName", null) != null ? request.get("fileName").toString() : null;
        String fileType = request.getOrDefault("fileType", null) != null ? request.get("fileType").toString() : null;

        return ResponseEntity.ok(ApiResponse.ok("Message sent", 
                messengerService.sendMessage(senderId, recipientId, content, fileUrl, fileName, fileType)));
    }

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadFile(@RequestParam("file") MultipartFile file) {
        String fileName = fileStorageService.storeFile(file);
        String fileUrl = "/api/messages/files/" + fileName;
        return ResponseEntity.ok(ApiResponse.ok("File uploaded", Map.of(
                "fileUrl", fileUrl,
                "fileName", file.getOriginalFilename(),
                "fileType", file.getContentType()
        )));
    }

    @GetMapping("/files/{filename:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
        try {
            Path filePath = fileStorageService.getFilePath(filename);
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found");
            }
        } catch (MalformedURLException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error retrieving file");
        }
    }

    private Long getCurrentUserId(Authentication auth) {
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .map(User::getId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
    }
}
