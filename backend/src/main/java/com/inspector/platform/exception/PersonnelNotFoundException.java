package com.inspector.platform.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class PersonnelNotFoundException extends RuntimeException {
    public PersonnelNotFoundException(String message) {
        super(message);
    }
}
