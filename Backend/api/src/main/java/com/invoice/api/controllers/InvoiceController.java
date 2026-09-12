package com.invoice.api.controllers;

import com.invoice.api.models.Invoice;
import com.invoice.api.services.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("api/invoices")
@RequiredArgsConstructor
public class InvoiceController{
    private final InvoiceService invoiceService;

    @PostMapping
    public Invoice createInvoice(@RequestBody Invoice invoice){
        return invoiceService.createInvoice(invoice);
    }
    @GetMapping("/user/{userId}")
    public List<Invoice> getInvoices(@PathVariable String userId){
        return invoiceService.getUserInvoices(userId);
    }
}