package com.invoice.api.controllers;

import com.invoice.api.dto.EmailRequest;
import com.invoice.api.services.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
public class EmailController {
    private final EmailService emailService;

    @PostMapping("/send")
    public ResponseEntity<Map<String, String>> sendInvoiceEmail(@RequestBody EmailRequest request) {
        try {
            emailService.sendInvoiceWithAttachment(
                request.getToEmail(),
                request.getClientName(),
                request.getInvoiceNumber(),
                request.getAmount(),
                request.getPdfBase64()
            );
            return ResponseEntity.ok(Map.of("message", "Email sent successfully!"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to send email: " + e.getMessage()));
        }
    }
}
