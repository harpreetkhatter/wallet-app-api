import { sql } from '../config/db.js';

export async function getTransactionsByUserId(req, res) {

    try {
        const { userid } = req.params;
        const transactions = await sql`
            SELECT * FROM transactions WHERE user_id = ${userid} ORDER BY created_at DESC
            `;
        res.status(200).json(transactions);

    } catch (e) {
        console.log("Error fetching transactions:", e);
        res.status(500).json({ message: "Internal server error" });

    }
}

export async function createTransactions(req, res) {
    try {
        const { user_id, title, amount, category } = req.body;
        if (!title || amount === undefined || !category || !user_id) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const transactions = await sql`
        INSERT INTO transactions(title, amount, category, user_id)
        VALUES (${title}, ${amount}, ${category}, ${user_id})
        RETURNING *
        `;
        res.status(201).json(transactions[0]);
    } catch (error) {
        console.log("Error creating transaction:", error);
        res.status(500).json({ message: "Internal server error" });

    }

}
export async function deleteTransaction(req, res) {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid transaction ID" });
        }

        const deletedTransaction = await sql`
      DELETE FROM transactions
      WHERE id = ${id}
      RETURNING *
    `;

        if (deletedTransaction.length === 0) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.status(200).json({
            message: "Transaction deleted successfully",
            transaction: deletedTransaction[0],
        });
    } catch (error) {
        console.error("Error deleting transaction:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export async function getTransactionSummary(req, res) {
    try {
        const { userid } = req.params;
        const balanceResult = await sql`
        SELECT COALESCE(SUM(amount),0) as balance FROM transactions WHERE user_id = ${userid} `

        const incomeResult = await sql`
        SELECT COALESCE(SUM(amount),0) as income FROM transactions WHERE user_id = ${userid} AND amount > 0`
        const expenseResult = await sql`
        SELECT COALESCE(SUM(amount),0) as expense FROM transactions WHERE user_id = ${userid} AND amount < 0`

        res.status(200).json({
            balance: balanceResult[0].balance,
            income: incomeResult[0].income,
            expense: expenseResult[0].expense

        })
    } catch (error) {
        console.log("Error creating the summary:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}