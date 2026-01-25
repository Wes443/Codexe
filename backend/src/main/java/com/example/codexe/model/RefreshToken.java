package com.example.codexe.model;

import java.time.Instant;
import java.util.UUID;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "refresh_tokens")
public class RefreshToken {
    //generate UUID automatically
    @Id
    @GeneratedValue
    @JdbcTypeCode(SqlTypes.BINARY)
    @Column(name = "token_id", columnDefinition = "BINARY(16)", nullable = false, updatable = false)
    private UUID tokenId;

    //a user can have multiple refresh tokens
    @ManyToOne(fetch = FetchType.LAZY)
    //create a relationship between the user_id columns
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, unique = true, length = 512)
    private String token;

    @Column(name = "issued_at", nullable = false)
    private Instant issuedAt;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(nullable = false)
    private boolean revoked;
    
    //constructor
    public RefreshToken(User user, String token, Instant issuedAt, Instant expiresAt) {
        this.user = user;
        this.token = token;
        this.expiresAt = expiresAt;
        this.issuedAt = issuedAt;
        this.revoked = false; // default
    }
}
