package edu4all.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu4all.model.ZoomToken;

@Repository
public interface ZoomTokenRepository extends JpaRepository<ZoomToken, Integer> {
}
