// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract OnlineOrderingSystem {
    struct Order {
        address customer;
        uint americanoQuantity;
        uint milkTeaQuantity;
        uint cappuccinoQuantity;
        uint totalAmount;
    }

    uint constant AMERICANO_PRICE = 10 wei;
    uint constant MILK_TEA_PRICE = 20 wei;
    uint constant CAPPUCCINO_PRICE = 30 wei;

    mapping(address => Order) public orders;
    address[] public customers;

    event OrderPlaced(address indexed customer, uint americanoQuantity, uint milkTeaQuantity, uint cappuccinoQuantity, uint totalAmount);

    function placeOrder(uint _americanoQuantity, uint _milkTeaQuantity, uint _cappuccinoQuantity) public payable {
        uint totalAmount = (_americanoQuantity * AMERICANO_PRICE) +
                           (_milkTeaQuantity * MILK_TEA_PRICE) +
                           (_cappuccinoQuantity * CAPPUCCINO_PRICE);
                           
        require(msg.value == totalAmount, "Incorrect payment amount");

        orders[msg.sender] = Order({
            customer: msg.sender,
            americanoQuantity: _americanoQuantity,
            milkTeaQuantity: _milkTeaQuantity,
            cappuccinoQuantity: _cappuccinoQuantity,
            totalAmount: totalAmount
        });

        customers.push(msg.sender);

        emit OrderPlaced(msg.sender, _americanoQuantity, _milkTeaQuantity, _cappuccinoQuantity, totalAmount);
    }

    function getOrder(address _customer) public view returns (Order memory) {
        return orders[_customer];
    }

    function withdrawFunds() public {
        payable(msg.sender).transfer(address(this).balance);
    }

    // Fallback function to accept payments
    receive() external payable {}
}
