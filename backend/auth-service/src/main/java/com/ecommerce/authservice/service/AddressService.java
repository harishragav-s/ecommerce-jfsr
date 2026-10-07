package com.ecommerce.authservice.service;

import com.ecommerce.authservice.dto.AddressRequest;
import com.ecommerce.authservice.model.Address;
import com.ecommerce.authservice.repository.AddressRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AddressService {

    private final AddressRepository addressRepository;

    public AddressService(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }

    public Address addAddress(AddressRequest request) {
        Address address = new Address();
        address.setUserId(request.getUserId());
        address.setAddress(request.getAddress());
        address.setCity(request.getCity());
        address.setPincode(request.getPincode());
        address.setPhone(request.getPhone());
        address.setNotes(request.getNotes());
        return addressRepository.save(address);
    }

    public List<Address> fetchAllAddress(String userId) {
        return addressRepository.findByUserId(userId);
    }

    public Optional<Address> editAddress(String userId, String addressId, AddressRequest request) {
        return addressRepository.findByIdAndUserId(addressId, userId).map(existing -> {
            if (request.getAddress() != null) existing.setAddress(request.getAddress());
            if (request.getCity() != null) existing.setCity(request.getCity());
            if (request.getPincode() != null) existing.setPincode(request.getPincode());
            if (request.getPhone() != null) existing.setPhone(request.getPhone());
            if (request.getNotes() != null) existing.setNotes(request.getNotes());
            return addressRepository.save(existing);
        });
    }

    public boolean deleteAddress(String userId, String addressId) {
        Optional<Address> existing = addressRepository.findByIdAndUserId(addressId, userId);
        if (existing.isEmpty()) return false;
        addressRepository.deleteByIdAndUserId(addressId, userId);
        return true;
    }
}
