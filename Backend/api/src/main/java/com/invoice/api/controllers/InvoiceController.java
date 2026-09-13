package com.invoice.api.controllers;

import com.invoice.api.dto.EmailRequest;
import com.invoice.api.models.Invoice;
import com.invoice.api.services.EmailService;
import com.invoice.api.services.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/invoices")
@RequiredArgsConstructor
public class InvoiceController {
    private final InvoiceService invoiceService;
    private final EmailService emailService;

    @PostMapping
    public Invoice createInvoice(@RequestBody Invoice invoice) {
        return invoiceService.createInvoice(invoice);
    }

    @GetMapping("/user/{userId}")
    public List<Invoice> getInvoices(@PathVariable String userId) {
        return invoiceService.getUserInvoices(userId);
    }

    /**
     * New endpoint: Sends the invoice PDF as an email attachment.
     * The frontend sends the PDF as a Base64 string inside the request body.
     */
    @PostMapping("/send-email")
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
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Failed to send email: " + e.getMessage()));
        }
    }

    @PutMapping("/mark-paid/{id}")
    public Invoice markAsPaid(@PathVariable String id) {
        return invoiceService.markAsPaid(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteInvoice(@PathVariable String id) {
        invoiceService.deleteInvoice(id);
        return ResponseEntity.ok(Map.of("message", "Invoice deleted"));
    }
}