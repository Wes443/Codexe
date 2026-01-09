package com.example.codexe.service;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.codexe.dao.UserDao;
import com.example.codexe.model.User;

@Service
public class UserService {
    private final UserDao userDao;
    
    public UserService(UserDao userDao) {
        this.userDao = userDao;
    }

    public List<User> getAllUsers() {
        return userDao.findAll();
    }
}
