import { BaseClass } from "./common.js";
import { Party } from "./party.js";
import { TransactionItem } from "./transaction-item.js"

export class Transaction extends BaseClass {
    constructor() {
        super();
        this.id = '';
        this.type = '';
        this.number = '';
        this.date = '';
        this.total = 0;
        this.balance = 0;
        this.party = null;
        this.items = [];
        this.received = 0;
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
            transactionCopy.party = Party.CopyFrom(transaction.party);
            transactionCopy.items = TransactionItem.CopyAllFrom(transaction.items);
            transactionCopy.received = transaction.received;
        }
        return transactionCopy;
    }
}