package com.webprogramming.backend.repository;

import com.webprogramming.backend.models.Log;
import jakarta.persistence.Table;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

@Table(name = "log")
public interface LogRepository extends JpaRepository<Log, Long> {
    @Modifying
    @Transactional
    @Query(value = "TRUNCATE TABLE log RESTART IDENTITY", nativeQuery = true)
    void truncateAndRestartIdentity();
}
