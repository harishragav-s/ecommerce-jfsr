package com.ecommerce.orderservice.service;

import com.ecommerce.orderservice.client.CartClient;
import com.ecommerce.orderservice.client.ProductClient;
import com.ecommerce.orderservice.dto.ApiResponse;
import com.ecommerce.orderservice.dto.CapturePaymentRequest;
import com.ecommerce.orderservice.dto.CreateOrderRequest;
import com.ecommerce.orderservice.dto.ProductDto;
import com.ecommerce.orderservice.model.Order;
import com.ecommerce.orderservice.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final PaypalService paypalService;
    private final ProductClient productClient;
    private final CartClient cartClient;

    public OrderService(OrderRepository orderRepository, PaypalService paypalService,
                         ProductClient productClient, CartClient cartClient) {
        this.orderRepository = orderRepository;
        this.paypalService = paypalService;
        this.productClient = productClient;
        this.cartClient = cartClient;
    }

    public static class CreateOrderResult {
        public String approvalURL;
        public String orderId;
        public CreateOrderResult(String approvalURL, String orderId) {
            this.approvalURL = approvalURL;
            this.orderId = orderId;
        }
    }

    public CreateOrderResult createOrder(CreateOrderRequest request) {
        Order order = new Order();
        order.setUserId(request.getUserId());
        order.setCartId(request.getCartId());
        order.setCartItems(request.getCartItems());
        order.setAddressInfo(request.getAddressInfo());
        order.setOrderStatus(request.getOrderStatus());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setPaymentStatus(request.getPaymentStatus());
        order.setTotalAmount(request.getTotalAmount());
        order.setOrderDate(request.getOrderDate() != null ? request.getOrderDate() : Instant.now());
        order.setOrderUpdateDate(request.getOrderUpdateDate());
        order.setPaymentId(request.getPaymentId());
        order.setPayerId(request.getPayerId());

        Order saved = orderRepository.save(order);
        String approvalUrl = paypalService.createApprovalUrl(saved.getId());

        return new CreateOrderResult(approvalUrl, saved.getId());
    }

    public static class CaptureResult {
        public boolean success;
        public String message;
        public int status;
        public Order order;
        public CaptureResult(boolean success, String message, int status, Order order) {
            this.success = success;
            this.message = message;
            this.status = status;
            this.order = order;
        }
    }

    public CaptureResult capturePayment(CapturePaymentRequest request) {
        Optional<Order> orderOpt = orderRepository.findById(request.getOrderId());
        if (orderOpt.isEmpty()) {
            return new CaptureResult(false, "Order can not be found", 404, null);
        }

        Order order = orderOpt.get();
        // Cash on delivery: the order is confirmed now, but nothing is paid until delivery
        boolean cashOnDelivery = "cod".equalsIgnoreCase(order.getPaymentMethod());
        order.setPaymentStatus(cashOnDelivery ? "pending" : "paid");
        order.setOrderStatus("confirmed");
        order.setPaymentId(request.getPaymentId());
        order.setPayerId(request.getPayerId());

        for (Order.OrderCartItem item : order.getCartItems()) {
            ApiResponse<ProductDto> response = productClient.decrementStock(item.getProductId(), item.getQuantity());
            if (response == null || !response.isSuccess()) {
                return new CaptureResult(false,
                        "Not enough stock for this product " + item.getTitle(), 404, null);
            }
        }

        if (order.getCartId() != null) {
            cartClient.deleteCartById(order.getCartId());
        }

        Order saved = orderRepository.save(order);
        return new CaptureResult(true, "Order confirmed", 200, saved);
    }

    public List<Order> getAllOrdersByUser(String userId) {
        return orderRepository.findByUserId(userId);
    }

    public Optional<Order> getOrderDetails(String id) {
        return orderRepository.findById(id);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Optional<Order> updateOrderStatus(String id, String orderStatus) {
        return orderRepository.findById(id).map(order -> {
            order.setOrderStatus(orderStatus);
            order.setOrderUpdateDate(Instant.now());
            return orderRepository.save(order);
        });
    }
}
