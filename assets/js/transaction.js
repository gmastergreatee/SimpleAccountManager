import { BaseClass } from "./common.js";

export class Transaction extends BaseClass {
    constructor() {
        super();
        this.id = '';
        this.type = '';
        this.number = '';
        this.date = '';
        this.total = 0;
        this.balance = 0;
    }

    static CopyFrom(transaction) {
        let transactionCopy = new Transaction();
        if (transaction) {
            transactionCopy.id = transaction.id;
            transactionCopy.type = transaction.type;
            transactionCopy.number = transaction.number;
            transactionCopy.date = transaction.date;
            transactionCopy.total = transaction.total;
            transactionCopy.balance = transaction.balance;
        }
        return transactionCopy;
    }
}