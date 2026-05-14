package com.inspector.platform.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class SerialCodeAlreadyExistsException extends RuntimeException {
    public SerialCodeAlreadyExistsException(String message) {
        super(message);
    }
}

