package com.invoice.api.dto;

import lombok.Data;

/**
 * DTO (Data Transfer Object) for sending invoice emails.
 * This is separate from the Invoice model — it carries the PDF data
 * which we don't want to store in MongoDB.
 */
@Data
public class EmailRequest {
    private String toEmail;
    private String clientName;
    private String invoiceNumber;
    private String amount;
    private String pdfBase64; // The PDF file as a Base64-encoded string
}
