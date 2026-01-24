package com.example.codexe.dao;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.codexe.model.RefreshToken;
import com.example.codexe.model.User;

import java.util.List;
import java.util.Optional;


@Repository
public interface RefreshTokenDao extends JpaRepository<RefreshToken, UUID> {
    Optional<RefreshToken> findByToken(String token);

    List<RefreshToken> findAllByUser(User user);

    void deleteByToken(String token);

    boolean existsByToken(String token);
}
