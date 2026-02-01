import express from 'express';

import { getTransactionsByUserId,createTransactions,deleteTransaction,getTransactionSummary } from '../controllers/transactionController.js';



const router = express.Router();

router.get("/:userid", getTransactionsByUserId
)
router.post("/", createTransactions
);
router.delete("/:id",deleteTransaction );
router.get("/summary/:userid",getTransactionSummary  )

export default router;