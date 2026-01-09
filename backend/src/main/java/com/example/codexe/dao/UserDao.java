package com.example.codexe.dao;

import java.util.UUID;
import com.example.codexe.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserDao extends JpaRepository<User, UUID> {
    
}
