package com.ecommerce.authservice.controller;

import com.ecommerce.authservice.dto.AddressRequest;
import com.ecommerce.authservice.dto.ApiResponse;
import com.ecommerce.authservice.model.Address;
import com.ecommerce.authservice.service.AddressService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/shop/address")
public class ShopAddressController {

    private final AddressService addressService;

    public ShopAddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<Address>> addAddress(@RequestBody AddressRequest request) {
        if (isBlank(request.getUserId()) || isBlank(request.getAddress()) || isBlank(request.getCity())
                || isBlank(request.getPincode()) || isBlank(request.getPhone()) || isBlank(request.getNotes())) {
            return ResponseEntity.status(400).body(ApiResponse.fail("Invalid data provided!"));
        }
        Address saved = addressService.addAddress(request);
        return ResponseEntity.status(201).body(ApiResponse.ok(saved));
    }

    @GetMapping("/get/{userId}")
    public ResponseEntity<ApiResponse<List<Address>>> fetchAllAddress(@PathVariable String userId) {
        if (isBlank(userId)) {
            return ResponseEntity.status(400).body(ApiResponse.fail("User id is required!"));
        }
        return ResponseEntity.ok(ApiResponse.ok(addressService.fetchAllAddress(userId)));
    }

    @PutMapping("/update/{userId}/{addressId}")
    public ResponseEntity<ApiResponse<Address>> editAddress(
            @PathVariable String userId, @PathVariable String addressId, @RequestBody AddressRequest request) {
        Optional<Address> updated = addressService.editAddress(userId, addressId, request);
        if (updated.isEmpty()) {
            return ResponseEntity.status(404).body(ApiResponse.fail("Address not found"));
        }
        return ResponseEntity.ok(ApiResponse.ok(updated.get()));
    }

    @DeleteMapping("/delete/{userId}/{addressId}")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(
            @PathVariable String userId, @PathVariable String addressId) {
        boolean deleted = addressService.deleteAddress(userId, addressId);
        if (!deleted) {
            return ResponseEntity.status(404).body(ApiResponse.fail("Address not found"));
        }
        return ResponseEntity.ok(ApiResponse.okMessage("Address deleted successfully"));
    }

    private boolean isBlank(String s) {
        return s == null || s.isBlank();
    }
}
