package edu4all.controller;

import java.io.File;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FileDownloadController {

    // Must match your uploadDir in application.properties (e.g. "uploads")
    @Value("${edu4all.upload.dir}")
    private String uploadDir;

    @GetMapping("/uploads/download/{filename}")
    public ResponseEntity<FileSystemResource> downloadFile(@PathVariable String filename) {
        // Get the file path
        String filePath = Paths.get("src", "main", "resources", "static", uploadDir, filename).toFile().getAbsolutePath();
        File file = new File(filePath);

        // Create a resource for the file
        FileSystemResource resource = new FileSystemResource(file);

        // Set the content disposition header to force download
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
            .body(resource);
    }
}
