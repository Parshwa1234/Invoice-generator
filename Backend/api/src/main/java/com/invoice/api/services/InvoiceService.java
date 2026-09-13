package com.invoice.api.services;

import com.invoice.api.models.Invoice;
import com.invoice.api.repositories.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InvoiceService {
    
    private final InvoiceRepository invoiceRepository;
    
    public Invoice createInvoice(Invoice invoice) {
        invoice.setStatus("UNPAID");
        return invoiceRepository.save(invoice);
    }
    
    public List<Invoice> getUserInvoices(String userId) {
        return invoiceRepository.findByUserId(userId);
    }

    public Invoice markAsPaid(String invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
            .orElseThrow(() -> new RuntimeException("Invoice not found"));
        invoice.setStatus("PAID");
        return invoiceRepository.save(invoice);
    }

    public void deleteInvoice(String invoiceId) {
        invoiceRepository.deleteById(invoiceId);
    }
}
