package edu4all.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")  
public class User {
  @Id
  @Column(name = "user_id")
  private Long userId;

  @Column(name = "name")
  private String name;

  // + any other fields you need

  // Getters & setters
  public Long getUserId() { return userId; }
  public void setUserId(Long userId) { this.userId = userId; }

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }
}
