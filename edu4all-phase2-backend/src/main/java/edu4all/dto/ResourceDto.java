// src/main/java/edu4all/dto/ResourceDto.java
package edu4all.dto;

import java.util.List;

/**
 * Data‐transfer object for an educational resource,
 * now including an optional cover photo URL.
 */
public class ResourceDto {
    private final int id;
    private final String title;
    private final String description;
    private final String subject;
    private final String coverPhotoUrl;  // new field
    private final List<String> files;

    /**
     * @param id             the resource ID
     * @param title          title text
     * @param description    description text
     * @param subject        subject text
     * @param coverPhotoUrl  filename or URL of the cover photo (may be null)
     * @param files          list of stored filenames for this resource
     */
    public ResourceDto(int id,
                       String title,
                       String description,
                       String subject,
                       String coverPhotoUrl,
                       List<String> files) {
        this.id            = id;
        this.title         = title;
        this.description   = description;
        this.subject       = subject;
        this.coverPhotoUrl = coverPhotoUrl;
        this.files         = files;
    }

    // Getters

    public int getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getSubject() {
        return subject;
    }

    /**
     * @return the cover photo filename/URL, or null if none was provided
     */
    public String getCoverPhotoUrl() {
        return coverPhotoUrl;
    }

    public List<String> getFiles() {
        return files;
    }
}
