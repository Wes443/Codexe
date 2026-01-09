package com.example.codexe.utils;

import org.springframework.http.HttpStatus;

public class Exception extends RuntimeException {
    //variable to hold http status code
    private final HttpStatus status;

    //constructor
    public Exception(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    //getter for status
    public HttpStatus getStatus() {
        return status;
    }
}
