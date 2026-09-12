package com.invoice.api.services;

import com.invoice.api.models.Client;
import com.invoice.api.repositories.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientService {
    
    private final ClientRepository clientRepository;
    
    public Client createClient(Client client) {
        return clientRepository.save(client);
    }
    
    public List<Client> getUserClients(String userId) {
        return clientRepository.findByUserId(userId);
    }
}
