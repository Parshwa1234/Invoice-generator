package com.invoice.api.services;

import com.invoice.api.dto.EmailRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.Map;

@FeignClient(name = "email-service")
public interface EmailClient {

    @PostMapping("/api/email/send")
    ResponseEntity<Map<String, String>> sendEmail(@RequestBody EmailRequest request);
}
