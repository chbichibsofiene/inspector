package com.inspector.platform.service.impl;

import com.inspector.platform.service.FileStorageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@Slf4j
public class FileStorageServiceImpl implements FileStorageService {

    private final Path rootPath;
    private final com.inspector.platform.service.LogService logService;

    public FileStorageServiceImpl(@Value("${app.upload.dir:uploads/messages}") String uploadDir, com.inspector.platform.service.LogService logService) {
        this.rootPath = Paths.get(uploadDir);
        this.logService = logService;
        try {
            Files.createDirectories(rootPath);
        } catch (IOException e) {
            log.error("Could not create upload directory", e);
        }
    }

    @Override
    public String storeFile(MultipartFile file) {
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        try {
            Path targetLocation = rootPath.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            logService.log(com.inspector.platform.entity.ActionType.CREATE, "File", fileName, "Uploaded file: " + file.getOriginalFilename());
            return fileName; 
        } catch (IOException e) {
            throw new RuntimeException("Could not store file " + fileName, e);
        }
    }

    @Override
    public Path getFilePath(String fileName) {
        return rootPath.resolve(fileName);
    }
}
