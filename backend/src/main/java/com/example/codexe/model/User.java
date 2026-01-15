package com.example.codexe.model;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name ="users")
public class User {
    //generate UUID automatically
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "user_id", columnDefinition = "BINARY(16)", nullable = false, updatable = false)
    private UUID userId;

    @Column(name = "email", nullable = false, unique=true)
    private String email;

    @Column(name = "username", nullable = false, unique=true)
    private String username;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "highest_wpm")
    private int highestWPM;

    @Column(name = "avg_wpm")
    private int averageWPM;

    @Column(name = "total_sessions")
    private int totalSessions;

    //constructor 
    public User(String email, String username, String passwordHash, int highestWPM, int averageWPM, int totalSessions) {
        this.email = email;
        this.username = username;
        this.passwordHash = passwordHash;
        this.highestWPM = highestWPM;
        this.averageWPM = averageWPM;
        this.totalSessions = totalSessions;
    }

    //overload constructor
    public User(String email, String username, String passwordHash){
        this(email, username, passwordHash, 0, 0, 0);
    }
}
