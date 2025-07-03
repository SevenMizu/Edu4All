package edu4all.controller.eduresource;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import edu4all.config.DatabaseConnection;
import edu4all.dto.ResourceDto;
import edu4all.utils.DatabaseConnectionUtils;

@RestController
@RequestMapping("/api/resources")
public class UploadEditController {

    @Value("${edu4all.upload.dir}")
    private String uploadDir;

    private final ObjectMapper om = new ObjectMapper();

    @GetMapping("/lastModified")
    public ResponseEntity<String> getLastModified(@RequestParam("userid") int userId) {
    return DatabaseConnectionUtils.connection(c -> {
        String sql = """
        SELECT COALESCE(MAX(last_modified), '1970-01-01 00:00:00') 
            FROM educational_resources 
        WHERE Upload_user_id = ?
        """;
        try (PreparedStatement ps = c.prepareStatement(sql)) {
        ps.setInt(1, userId);
        try (ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {
            Timestamp ts = rs.getTimestamp(1);
            // toInstant() always gives you a UTC-based Instant
            return ResponseEntity.ok(ts.toInstant().toString());
            }
        }
        }
        // fallback if somehow no row
        return ResponseEntity.ok(Instant.EPOCH.toString());
    });
    }



    /**
     * List all resources *for the given user* with their files.
     * GET /api/resources?userid=3
     */
    @GetMapping
    public List<ResourceDto> listResources(@RequestParam("userid") int userId) {
        return DatabaseConnectionUtils.connection(c -> {
            // 1) read all resources for *this* user, including the cover photo URL
            String rSql = """
            SELECT Resource_ID,
                    Title,
                    Description,
                    Subject,
                    Cover
                FROM educational_resources
            WHERE Upload_user_id = ?
            """;
            Map<Integer, ResourceDto> map = new LinkedHashMap<>();
            try (PreparedStatement pr = c.prepareStatement(rSql)) {
                pr.setInt(1, userId);
                try (ResultSet rs = pr.executeQuery()) {
                    while (rs.next()) {
                        int    id       = rs.getInt("Resource_ID");
                        String t        = rs.getString("Title");
                        String d        = rs.getString("Description");
                        String s        = rs.getString("Subject");
                        String coverUrl = rs.getString("Cover");  // may be null
                        map.put(id, new ResourceDto(
                            id,
                            t,
                            d,
                            s,
                            coverUrl,
                            new ArrayList<>()
                        ));
                    }
                }
            }

            // 2) read all files for *those* resource IDs
            if (!map.isEmpty()) {
                String inClause = map.keySet().stream()
                                    .map(Object::toString)
                                    .collect(Collectors.joining(","));
                String fSql = """
                SELECT r_id, file_url
                    FROM resources_files
                WHERE r_id IN (%s)
                ORDER BY rf_id
                """.formatted(inClause);

                try (PreparedStatement pf = c.prepareStatement(fSql);
                    ResultSet fs = pf.executeQuery()) {
                    while (fs.next()) {
                        int rid = fs.getInt("r_id");
                        String url = fs.getString("file_url");
                        map.get(rid).getFiles().add(url);
                    }
                }
            }

            // 3) return in insertion order
            return new ArrayList<>(map.values());
        });
    }

    /**
     * Upload a new educational resource.
     * POST /api/resources
     */
    private static final Logger log = LoggerFactory.getLogger(UploadEditController.class);

    // 1) Update the uploadMultiple signature to accept an optional coverPhoto:
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<List<String>> uploadMultiple(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String subject,
            @RequestParam String userid,
            @RequestParam(value = "coverPhoto", required = false) MultipartFile coverPhoto,
            @RequestParam("files") MultipartFile[] files) {

        if (files == null || files.length == 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "At least one file must be provided");
        }

        List<String> results = new ArrayList<>();

        try (Connection c = DatabaseConnection.getConnection()) {
            c.setAutoCommit(false);

            // --- a) insert the resource metadata ---
            int resourceId = insertResource(c, title, description, subject, Integer.parseInt(userid));

            // --- b) if provided, store coverPhoto and update the resource row ---
            if (coverPhoto != null && !coverPhoto.isEmpty()) {
                String coverFilename = doUploadCover(resourceId, coverPhoto);
                String upd = """
                    UPDATE educational_resources
                    SET Cover = ?
                    WHERE Resource_ID = ?
                """;
                try (PreparedStatement ps = c.prepareStatement(upd)) {
                    ps.setString(1, coverFilename);
                    ps.setInt(2, resourceId);
                    ps.executeUpdate();
                }
            }

            // --- c) store all other files ---
            for (MultipartFile file : files) {
                results.add(doUpload(c, resourceId, file));
            }

            c.commit();
        } catch (SQLException | IOException e) {
            log.error("uploadMultiple failed", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Upload failed", e);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(results);
    }


    // 2) New helper to save just the cover photo and return its filename:
    private String doUploadCover(int resourceId, MultipartFile file) throws IOException {
        // ensure upload directory exists
        Path uploadPath = Paths.get("src", "main", "resources", "static", uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // build a unique, lowercase, underscored filename
        String original = file.getOriginalFilename();
        if (original == null) {
            throw new IOException("Cover photo has no name");
        }
        int dot = original.lastIndexOf('.');
        String base = (dot > 0 ? original.substring(0, dot) : original)
                        .toLowerCase()
                        .replaceAll("\\s+", "_");
        String ext = dot > 0 ? original.substring(dot).toLowerCase() : "";
        String uniqueName = base + "_cover_" + System.currentTimeMillis() + ext;

        // copy file to disk
        Path target = uploadPath.resolve(uniqueName);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        return uniqueName;
    }

    /**
     * Inserts one row into educational_resources and returns its generated ID.
     */
    private int insertResource(Connection c,
                               String title,
                               String description,
                               String subject,
                               int userId) throws SQLException {
        String sql = """
            INSERT INTO educational_resources
                (Title, Description, Subject, Upload_user_id, Upload_Date)
            VALUES (?, ?, ?, ?, NOW())
            """;
        try (PreparedStatement ps = c.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, title);
            ps.setString(2, description);
            ps.setString(3, subject);
            ps.setInt(4, userId);
            ps.executeUpdate();
            try (ResultSet rs = ps.getGeneratedKeys()) {
                if (rs.next()) return rs.getInt(1);
            }
        }
        throw new SQLException("Failed to retrieve new resource ID");
    }

    /**
     * Stores one file to disk + one row into resources_files, returns "rId,filename".
     */
    private String doUpload(Connection c,
                            int resourceId,
                            MultipartFile file) throws SQLException, IOException {
        // ensure upload directory exists
        Path uploadPath = Paths.get("src", "main", "resources", "static", uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // build a unique, lowercase, underscore filename
        String original = file.getOriginalFilename();
        if (original == null) throw new IOException("File has no name");
        int dot = original.lastIndexOf('.');
        String base = (dot > 0 ? original.substring(0, dot) : original)
                          .toLowerCase()
                          .replaceAll("\\s+", "_");
        String ext = dot > 0 ? original.substring(dot).toLowerCase() : "";
        String uniqueName = base + "_" + System.currentTimeMillis() + ext;

        // copy file
        Path target = uploadPath.resolve(uniqueName);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        // record into resources_files
        String sql = """
            INSERT INTO resources_files
                (r_id, file_url, upload_date)
            VALUES (?, ?, NOW())
            """;
        try (PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setInt(1, resourceId);
            ps.setString(2, uniqueName);
            ps.executeUpdate();
        }

        return resourceId + "," + uniqueName;
    }

    @PostMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> edit(
            @PathVariable String id,
            @RequestParam("title")       String title,
            @RequestParam("description") String description,
            @RequestParam("subject")     String subject,
            @RequestParam(value="removedCover", required=false) boolean removedCover,
            @RequestParam(value="coverPhoto",   required=false) MultipartFile coverPhoto,
            @RequestParam(value="removedFiles", required=false) String removedFilesJson,
            @RequestParam(value="files",        required=false) MultipartFile[] newFiles
    ) {
        int resourceId = Integer.parseInt(id);

        try (Connection c = DatabaseConnection.getConnection()) {
            c.setAutoCommit(false);

            // 1) Update metadata *and* last_modified
            String updateSql = """
                UPDATE educational_resources
                SET Title = ?,
                    Description = ?,
                    Subject = ?,
                    Upload_Date = NOW(),
                    last_modified = NOW()
                WHERE Resource_ID = ?
            """;
            try (PreparedStatement ps = c.prepareStatement(updateSql)) {
                ps.setString(1, title);
                ps.setString(2, description);
                ps.setString(3, subject);
                ps.setInt(4, resourceId);
                ps.executeUpdate();
            }

            // 2) Clear existing cover if requested
            if (removedCover) {
                String clearCoverSql = """
                    UPDATE educational_resources
                    SET Cover = NULL,
                        last_modified = NOW()
                    WHERE Resource_ID = ?
                """;
                try (PreparedStatement ps = c.prepareStatement(clearCoverSql)) {
                    ps.setInt(1, resourceId);
                    ps.executeUpdate();
                }
            }

            // 3) Save and set new cover if provided
            if (coverPhoto != null && !coverPhoto.isEmpty()) {
                String filename = doUploadCover(resourceId, coverPhoto);
                String setCoverSql = """
                    UPDATE educational_resources
                    SET Cover = ?,
                        last_modified = NOW()
                    WHERE Resource_ID = ?
                """;
                try (PreparedStatement ps = c.prepareStatement(setCoverSql)) {
                    ps.setString(1, filename);
                    ps.setInt(2, resourceId);
                    ps.executeUpdate();
                }
            }

            // ... rest of your remove/upload files logic unchanged ...

            c.commit();
        } catch (Exception e) {
            throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update resource", e
            );
        }

        return ResponseEntity.ok().build();
    }


    /**
     * Stores one file on disk and records it into resources_files.
     * This is basically your old doUpload renamed—but reusing the same pattern.
     */
    private String doEdit(Connection c, int resourceId, MultipartFile file)
            throws SQLException, IOException {

        // ensure upload dir
        Path uploadPath = Paths.get("src","main","resources","static", uploadDir);
        if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);

        // build unique lowercase filename
        String original = file.getOriginalFilename();
        if (original == null) throw new IOException("File has no name");
        int dot = original.lastIndexOf('.');
        String base = (dot>0?original.substring(0,dot):original)
                            .toLowerCase().replaceAll("\\s+","_");
        String ext = dot>0?original.substring(dot).toLowerCase():"";
        String unique = base + "_" + System.currentTimeMillis() + ext;

        // copy file
        Files.copy(file.getInputStream(),
                    uploadPath.resolve(unique),
                    StandardCopyOption.REPLACE_EXISTING);

        // insert into resources_files
        String ins = """
            INSERT INTO resources_files
            (r_id, file_url, upload_date)
            VALUES (?, ?, NOW())
        """;
        try (PreparedStatement ps = c.prepareStatement(ins)) {
            ps.setInt(1, resourceId);
            ps.setString(2, unique);
            ps.executeUpdate();
        }

        return unique;
    }

    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty() || "null".equals(s);
    }

    /**
     * Delete a resource and all its file‐records (and optionally remove files on disk).
     * DELETE /api/resources/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable int id) {
        try (Connection c = DatabaseConnection.getConnection()) {
            c.setAutoCommit(false);

            // 1) delete file‐records from resources_files
            try (PreparedStatement ps = c.prepareStatement(
                    "DELETE FROM resources_files WHERE r_id = ?")) {
                ps.setInt(1, id);
                ps.executeUpdate();
            }

            // 2) delete the resource row
            try (PreparedStatement ps = c.prepareStatement(
                    "DELETE FROM educational_resources WHERE Resource_ID = ?")) {
                ps.setInt(1, id);
                ps.executeUpdate();
            }

            // (optional) you could also delete the physical files on disk
            // if you want:
            //   List<String> toRemove = ... query filenames ...
            //   Files.deleteIfExists(...);

            c.commit();
            return ResponseEntity.noContent().build();
        } catch (SQLException e) {
            throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR, "Failed to delete resource", e
            );
        }
    }

    /**
     * List *all* resources (no user filter) with their cover and files.
     * GET /api/resources/all
     */
    @GetMapping("/all")
    public List<ResourceDto> listAllResources() {
        return DatabaseConnectionUtils.connection(c -> {
            // 1) read every resource
            String rSql = """
                SELECT Resource_ID, Title, Description, Subject, Cover
                  FROM educational_resources
            """;
            Map<Integer, ResourceDto> map = new LinkedHashMap<>();
            try (PreparedStatement ps = c.prepareStatement(rSql);
                 ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    int id         = rs.getInt("Resource_ID");
                    String title   = rs.getString("Title");
                    String desc    = rs.getString("Description");
                    String subj    = rs.getString("Subject");
                    String cover   = rs.getString("Cover"); 
                    map.put(id, new ResourceDto(id, title, desc, subj, cover, new ArrayList<>()));
                }
            }

            // 2) bulk‐load all files
            if (!map.isEmpty()) {
                String in = map.keySet().stream().map(Object::toString).collect(Collectors.joining(","));
                String fSql = """
                    SELECT r_id, file_url
                      FROM resources_files
                     WHERE r_id IN (%s)
                     ORDER BY rf_id
                """.formatted(in);
                try (PreparedStatement ps = c.prepareStatement(fSql);
                     ResultSet fs = ps.executeQuery()) {
                    while (fs.next()) {
                        int rid = fs.getInt("r_id");
                        String url = fs.getString("file_url");
                        map.get(rid).getFiles().add(url);
                    }
                }
            }

            return new ArrayList<>(map.values());
        });
    }

    /**
     * GET /api/resources/{id}
     * Return one resource (metadata + cover + files).
     */
    @GetMapping("/{id:\\d+}")
    public ResourceDto getResource(@PathVariable int id) {
        return DatabaseConnectionUtils.connection(c -> {
            // 1) load the metadata + cover
            String rSql = """
                SELECT Resource_ID, Title, Description, Subject, Cover
                FROM educational_resources
                WHERE Resource_ID = ?
            """;
            ResourceDto dto = null;
            try (PreparedStatement ps = c.prepareStatement(rSql)) {
                ps.setInt(1, id);
                try (ResultSet rs = ps.executeQuery()) {
                    if (rs.next()) {
                        String title    = rs.getString("Title");
                        String desc     = rs.getString("Description");
                        String subj     = rs.getString("Subject");
                        String coverUrl = rs.getString("Cover");  // may be null
                        dto = new ResourceDto(id, title, desc, subj, coverUrl, new ArrayList<>());
                    } else {
                        throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Resource " + id + " not found");
                    }
                }
            }

            // 2) load its files
            String fSql = "SELECT file_url FROM resources_files WHERE r_id = ? ORDER BY rf_id";
            try (PreparedStatement ps = c.prepareStatement(fSql)) {
                ps.setInt(1, id);
                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        dto.getFiles().add(rs.getString("file_url"));
                    }
                }
            }
            return dto;
        });
    }




}
