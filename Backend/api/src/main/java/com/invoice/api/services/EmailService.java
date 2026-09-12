package com.invoice.api.services;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService{
    private final JavaMailSender mailSender;
    public void sendInvoiceEmail(String toEmail, String companyName,String previewLink){
        SimpleMailMessage message=new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("New Invoice from "+companyName);
        message.setText("Hello! You have received a new invoice. You can view and download it here: \n\n"+previewLink);
        mailSender.send(message);
    }
}