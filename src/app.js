//
document.addEventListener('DOMContentLoaded', () => {
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');
    }

    const web3 = new Web3(window.ethereum);
    const contractAddress = '0x0d0CDC5F2eB42443590C60BdC6ac6b90844684cF';
    const contractABI = [
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "customer",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "americanoQuantity",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "milkTeaQuantity",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "cappuccinoQuantity",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "totalAmount",
                    "type": "uint256"
                }
            ],
            "name": "OrderPlaced",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "customers",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "orders",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "customer",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "americanoQuantity",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "milkTeaQuantity",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "cappuccinoQuantity",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "totalAmount",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
        },
        {
            "stateMutability": "payable",
            "type": "receive",
            "payable": true
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_americanoQuantity",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "_milkTeaQuantity",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "_cappuccinoQuantity",
                    "type": "uint256"
                }
            ],
            "name": "placeOrder",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function",
            "payable": true
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_customer",
                    "type": "address"
                }
            ],
            "name": "getOrder",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "address",
                            "name": "customer",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "americanoQuantity",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "milkTeaQuantity",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "cappuccinoQuantity",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "totalAmount",
                            "type": "uint256"
                        }
                    ],
                    "internalType": "struct OnlineOrderingSystem.Order",
                    "name": "",
                    "type": "tuple"
                }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
        },
        {
            "inputs": [],
            "name": "withdrawFunds",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ] // Your contract ABI here

    const contract = new web3.eth.Contract(contractABI, contractAddress);
    let account;

    const customerAddressEl = document.getElementById('customerAddress');
    const accountBalanceEl = document.getElementById('accountBalance');
    const americanoQtyEl = document.getElementById('americanoQty');
    const milkTeaQtyEl = document.getElementById('milkTeaQty');
    const cappuccinoQtyEl = document.getElementById('cappuccinoQty');
    const confirmOrderBtn = document.getElementById('confirmOrder');
    const orderSummaryEl = document.getElementById('orderSummary');
    const orderDetailsEl = document.getElementById('orderDetails');
    const totalCostEl = document.getElementById('totalCost');
    const payOrderBtn = document.getElementById('payOrder');

    async function loadAccountData() {
        const accounts = await web3.eth.requestAccounts();
        account = accounts[0];
        customerAddressEl.innerText = account;

        const balance = await web3.eth.getBalance(account);
        accountBalanceEl.innerText = web3.utils.fromWei(balance, 'ether');
    }

    async function confirmOrder() {
        const americanoQty = parseInt(americanoQtyEl.value) || 0;
        const milkTeaQty = parseInt(milkTeaQtyEl.value) || 0;
        const cappuccinoQty = parseInt(cappuccinoQtyEl.value) || 0;

        const totalCost = (americanoQty * 10) + (milkTeaQty * 20) + (cappuccinoQty * 30);
        orderDetailsEl.innerText = `
            Americano: ${americanoQty}
            Milk Tea: ${milkTeaQty}
            Cappuccino: ${cappuccinoQty}
        `;
        totalCostEl.innerText = totalCost;
        orderSummaryEl.classList.remove('hidden');
    }

    async function payOrder() {
        const americanoQty = parseInt(americanoQtyEl.value) || 0;
        const milkTeaQty = parseInt(milkTeaQtyEl.value) || 0;
        const cappuccinoQty = parseInt(cappuccinoQtyEl.value) || 0;
        const totalCost = (americanoQty * 10) + (milkTeaQty * 20) + (cappuccinoQty * 30);

        await contract.methods.placeOrder(americanoQty, milkTeaQty, cappuccinoQty).send({
            from: account,
            value: totalCost
        });

        alert('Payment successful!');
        orderSummaryEl.classList.add('hidden');
        americanoQtyEl.value = '';
        milkTeaQtyEl.value = '';
        cappuccinoQtyEl.value = '';
        loadAccountData();
    }

    confirmOrderBtn.addEventListener('click', confirmOrder);
    payOrderBtn.addEventListener('click', payOrder);

    loadAccountData();
});
