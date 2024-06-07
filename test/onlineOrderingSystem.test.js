const OnlineOrderingSystem = artifacts.require("OnlineOrderingSystem");

contract("OnlineOrderingSystem", (accounts) => {
    let instance;
    const AMERICANO_PRICE = 10;
    const MILK_TEA_PRICE = 20;
    const CAPPUCCINO_PRICE = 30;

    before(async () => {
        instance = await OnlineOrderingSystem.deployed();
    });

    it("should place an order correctly", async () => {
        await instance.placeOrder(1, 1, 1, { value: 60, from: accounts[0] });
        const order = await instance.getOrder(accounts[0]);

        assert.equal(order.americanoQuantity.toString(), '1', "Americano quantity is incorrect");
        assert.equal(order.milkTeaQuantity.toString(), '1', "Milk Tea quantity is incorrect");
        assert.equal(order.cappuccinoQuantity.toString(), '1', "Cappuccino quantity is incorrect");
        assert.equal(order.totalAmount.toString(), '60', "Total amount is incorrect");
    });

    it("should reject incorrect payment amount", async () => {
        try {
            await instance.placeOrder(1, 1, 1, { value: 50, from: accounts[1] });
            assert.fail("The transaction should have thrown an error");
        } catch (err) {
            assert.include(err.message, "revert", "The error message should contain 'revert'");
        }
    });

    it("should allow owner to withdraw funds", async () => {
        // Ensure the contract has funds to withdraw
        await instance.placeOrder(1, 1, 1, { value: 60, from: accounts[1] });

        const initialBalance = web3.utils.toBN(await web3.eth.getBalance(accounts[0]));
        const transaction = await instance.withdrawFunds({ from: accounts[0] });

        const gasUsed = transaction.receipt.gasUsed;
        const tx = await web3.eth.getTransaction(transaction.tx);
        const gasPrice = web3.utils.toBN(tx.gasPrice);
        const gasCost = gasPrice.mul(web3.utils.toBN(gasUsed));

        const finalBalance = web3.utils.toBN(await web3.eth.getBalance(accounts[0]));

        assert.isTrue(finalBalance.gt(initialBalance.sub(gasCost)), "Owner should have withdrawn funds");
    });

    it("should record multiple orders correctly", async () => {
        await instance.placeOrder(2, 2, 2, { value: 120, from: accounts[2] });
        const order = await instance.getOrder(accounts[2]);

        assert.equal(order.americanoQuantity.toString(), '2', "Americano quantity is incorrect");
        assert.equal(order.milkTeaQuantity.toString(), '2', "Milk Tea quantity is incorrect");
        assert.equal(order.cappuccinoQuantity.toString(), '2', "Cappuccino quantity is incorrect");
        assert.equal(order.totalAmount.toString(), '120', "Total amount is incorrect");
    });
});
