package com.invoice.api.controllers;

import com.invoice.api.models.Client;
import com.invoice.api.services.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
public class ClientController{
    private final ClientService clientService;

    @PostMapping 
    public Client createClient(@RequestBody Client client){
        return clientService.createClient(client);
    }
    @GetMapping("/user/{userId}")
    public List<Client>getClients(@PathVariable String userId){
        return clientService.getUserClients(userId);
    }
}