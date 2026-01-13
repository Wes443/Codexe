package com.example.codexe.service;
import java.util.List;

import org.hibernate.exception.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.codexe.dao.UserDao;
import com.example.codexe.model.User;
import com.example.codexe.utils.CustomException;

@Service
public class UserService {
    //user data access object (dao)
    private final UserDao userDao;
    //password encoder for hashing passwords
    private final PasswordEncoder passwordEncoder;
    
    //constructor
    public UserService(UserDao userDao, PasswordEncoder passwordEncoder) {
        this.userDao = userDao;
        this.passwordEncoder = passwordEncoder;
    }

    //call user dao and return all the users in the database
    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userDao.findAll();
    }

    @Transactional(readOnly = true)
    public User getUserByUsername(String username){
        return userDao.findByUsername(username).orElseThrow(() -> new CustomException("Username not found", HttpStatus.NOT_FOUND));
    }

    //call user dao and add a new user to the database
    @Transactional
    public User createUser(User user) {
        try {
            //encode user's password
            String encryptedPassword = passwordEncoder.encode(user.getPasswordHash());
            //store the encoded password in the database
            user.setPasswordHash(encryptedPassword);
            //update the database

            User savedUser = userDao.save(user);
            userDao.flush();
            return savedUser;

        } catch (DataIntegrityViolationException e){
            // Throwable ex = e.getMostSpecificCause();
            // String message = ex.getMessage();
            
            // if (message != null && message.contains("users.email")){
            //     throw new CustomException("An Account With This Email Aready Exists", HttpStatus.CONFLICT);
            // }

            // if (message != null && message.contains("users.username")){
            //     throw new CustomException("Username Already In Use", HttpStatus.CONFLICT);
            // }
            
            //generic exception in case of unknown error
            throw new CustomException("An Unexpected Error Occured", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //validate the user's credentials
    public User validateCredentials(String username, String password){
        //validate username
        User user = getUserByUsername(username);

        //validate password
        if (!passwordEncoder.matches(password, user.getPasswordHash())){
            throw new CustomException("Invalid password", HttpStatus.UNAUTHORIZED);
        }

        return user;
    }

}
