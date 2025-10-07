const transactionService = require('./TransactionService');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// ROUTES FOR OUR API
// =======================================================

// Health Checking
app.get('/health', (req, res) => {
    res.json("This is the health check");
});

// ADD TRANSACTION
app.post('/transaction', (req, res) => {
    try {
        console.log(req.body);
        const { amount, desc } = req.body;
        if (amount === undefined || desc === undefined) {
            return res.status(400).json({ message: 'amount and desc are required' });
        }
        const success = transactionService.addTransaction(amount, desc);
        if (success === 200) {
            res.json({ message: 'added transaction successfully' });
        } else {
            res.status(500).json({ message: 'failed to add transaction' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'something went wrong', error: err.message });
    }
});

// GET ALL TRANSACTIONS
app.get('/transaction', (req, res) => {
    try {
        transactionService.getAllTransactions((results) => {
            const transactionList = results.map(row => ({
                id: row.id,
                amount: row.amount,
                description: row.description
            }));
            res.status(200).json({ result: transactionList });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "could not get all transactions", error: err.message });
    }
});

// DELETE ALL TRANSACTIONS
app.delete('/transaction', (req, res) => {
    try {
        transactionService.deleteAllTransactions(() => {
            res.status(200).json({ message: "delete function execution finished." });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Deleting all transactions may have failed.", error: err.message });
    }
});

// DELETE ONE TRANSACTION
app.delete('/transaction/id', (req, res) => {
    try {
        const { id } = req.body;
        if (!id) return res.status(400).json({ message: "id is required" });

        transactionService.deleteTransactionById(id, () => {
            res.status(200).json({ message: `transaction with id ${id} deleted successfully` });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "error deleting transaction", error: err.message });
    }
});

// GET SINGLE TRANSACTION
app.get('/transaction/id', (req, res) => {
    try {
        const { id } = req.body;
        if (!id) return res.status(400).json({ message: "id is required" });

        transactionService.findTransactionById(id, (result) => {
            if (!result || result.length === 0) {
                return res.status(404).json({ message: "transaction not found" });
            }
            const row = result[0];
            res.status(200).json({
                id: row.id,
                amount: row.amount,
                desc: row.description || row.desc
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "error retrieving transaction", error: err.message });
    }
});

app.listen(port, () => {
    console.log(`AB3 backend app listening at http://localhost:${port}`);
});
