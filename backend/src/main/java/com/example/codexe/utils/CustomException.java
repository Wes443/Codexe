package com.example.codexe.utils;

import org.springframework.http.HttpStatus;

public class CustomException extends RuntimeException {
    //variable to hold http status code
    private final HttpStatus status;

    //constructor
    public CustomException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    //getter for status
    public HttpStatus getStatus() {
        return status;
    }
}
