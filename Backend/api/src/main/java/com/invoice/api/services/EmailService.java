package com.invoice.api.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    /**
     * Sends an email with the invoice PDF attached.
     * @param toEmail     The client's email address
     * @param clientName  The client's name
     * @param invoiceNumber  The invoice number (e.g. INV-1234)
     * @param amount      The total amount
     * @param pdfBase64   The PDF file encoded as a Base64 string
     */
    public void sendInvoiceWithAttachment(String toEmail, String clientName,
                                           String invoiceNumber, String amount,
                                           String pdfBase64) throws MessagingException {

        // Decode the Base64 PDF string back into raw bytes
        byte[] pdfBytes = Base64.getDecoder().decode(pdfBase64);

        // MimeMessage allows attachments (SimpleMailMessage does not)
        MimeMessage message = mailSender.createMimeMessage();

        // 'true' enables multipart mode (required for attachments)
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(toEmail);
        helper.setSubject("Invoice " + invoiceNumber + " - $" + amount);
        helper.setText(
            "<div style='font-family: Arial, sans-serif; padding: 20px;'>" +
            "<h2 style='color: #6366f1;'>Invoice " + invoiceNumber + "</h2>" +
            "<p>Hi " + clientName + ",</p>" +
            "<p>Please find your invoice attached for <strong>$" + amount + "</strong>.</p>" +
            "<p>Payment is due within 14 days.</p>" +
            "<br/><p>Thank you for your business!</p>" +
            "</div>",
            true // true = HTML email
        );

        // Attach the PDF
        helper.addAttachment(invoiceNumber + ".pdf", new ByteArrayResource(pdfBytes));

        mailSender.send(message);
    }
}