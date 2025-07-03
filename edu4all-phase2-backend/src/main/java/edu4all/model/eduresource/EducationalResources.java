package edu4all.model.eduresource;

public class EducationalResources {
    private String id;
    private String title;
    private String description;
    private String subject;
    private String userid;
    private String file;
    private String coverPhotoUrl;  // new field

    // Default constructor for Jackson
    public EducationalResources() { }

    /**
     * All-args constructor (updated to include coverPhotoUrl).
     */
    public EducationalResources(
            String id,
            String title,
            String description,
            String subject,
            String userid,
            String file,
            String coverPhotoUrl) {
        this.id            = id;
        this.title         = title;
        this.description   = description;
        this.subject       = subject;
        this.userid        = userid;
        this.file          = file;
        this.coverPhotoUrl = coverPhotoUrl;
    }

    // Getters & setters

    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    public String getSubject() {
        return subject;
    }
    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getUserid() {
        return userid;
    }
    public void setUserid(String userid) {
        this.userid = userid;
    }

    public String getFile() {
        return file;
    }
    public void setFile(String file) {
        this.file = file;
    }

    /**
     * @return the cover photo filename or URL, or null if none was provided
     */
    public String getCoverPhotoUrl() {
        return coverPhotoUrl;
    }
    public void setCoverPhotoUrl(String coverPhotoUrl) {
        this.coverPhotoUrl = coverPhotoUrl;
    }
}
