package edu4all.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import edu4all.model.Session;

public interface SessionRepository extends JpaRepository<Session, Long> {

}
