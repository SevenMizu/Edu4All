// src/main/java/edu4all/config/WebMvcConfig.java
package edu4all.config;

import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    // must match your uploadDir in application.properties (e.g. "uploads")
    @Value("${edu4all.upload.dir}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // point /uploads/** → file system path src/main/resources/static/uploads/
        String absolutePath = Paths
            .get("src", "main", "resources", "static", uploadDir)
            .toFile()
            .getAbsolutePath() + "/";
        registry
          .addResourceHandler("/" + uploadDir + "/**")
          .addResourceLocations("file:" + absolutePath);
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // expose Accept-Ranges on your upload endpoints
        registry.addMapping("/" + uploadDir + "/**")
                .allowedOrigins("*")                     // or restrict to your front-end
                .exposedHeaders("Accept-Ranges");        // PDF.js needs to read this
    }
}
