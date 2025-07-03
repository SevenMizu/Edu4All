package edu4all.controller.eduresource;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu4all.utils.DatabaseConnectionUtils;

/**
 * Handles the REST API endpoints.
 */
@RestController
@RequestMapping("/")
public class BrowseSearchController {

  @GetMapping("/getbrowse")
  public String getbrowse() {
    // Establish connection
    return DatabaseConnectionUtils.connection(this::browse);
  }

  public String browse(Connection c) {
    String sql = "SELECT * FROM educational_resources";
    try (Statement stmt = c.createStatement();
        ResultSet rs = stmt.executeQuery(sql)) {
      String output = "";
      while (rs.next()) {
        String title = rs.getString("Title");
        String description = rs.getString("Description");
        String subject = rs.getString("Subject");
        System.out.println(title + " - " + description + " - " + subject);
        output += title + " - " + description + " - " + subject + "\n";
      }
      return output;
    } catch (SQLException qex) {
      System.err.println("Query failed: " + qex.getMessage());
    }
    return "";
  }

  @GetMapping("/getsearch")
  public String getsearch(@RequestParam String keyword) {
    return DatabaseConnectionUtils.connection((c) -> search(c, keyword));
  }

  public String search(Connection c, String keyword) {
    String sql = "SELECT educational_resources.Title, users.username, educational_resources.File_url FROM educational_resources "
        + "JOIN users ON educational_resources.Upload_user_id = users.user_id WHERE Title = '" + keyword
        + "' OR Description LIKE '%" + keyword
        + "%' OR Subject = '" + keyword + "'";
    try (Statement stmt = c.createStatement();
        ResultSet rs = stmt.executeQuery(sql)) {
      String output = "";
      while (rs.next()) {
        String noteTitle = rs.getString("Title");
        String userid = rs.getString("username");
        String url = rs.getString("File_url");
        System.out.println(noteTitle + " - " + userid + " - " + url);
        output += noteTitle + " - " + userid + " - " + url + "\n";
      }
      return output;
    } catch (SQLException qex) {
      System.err.println("Query failed: " + qex.getMessage());
    }
    return "";
  }
}
