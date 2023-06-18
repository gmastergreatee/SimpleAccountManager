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
        this.party = null;
        this.items = [];
        this.received = 0;
        this.due = 0;
    }

    static From(date, party, items, received, type, receiptNo) {
        let transaction = new Transaction();
        transaction.id = this.GetId;
        transaction.type = type;
        transaction.number = receiptNo;
        transaction.date = date;
        transaction.party = party;
        transaction.items = items;
        transaction.received = received;
        transaction.due = items.map((a) => {
            return parseFloat(a.quantity) * parseFloat(a.item.price);
        }).reduce((a, b) => {
            a += b;
            return a;
        }, 0);
        return transaction;
    }

    static CopyFrom(transaction) {
        let transactionCopy = new Transaction();
        if (transaction) {
            transactionCopy.id = transaction.id;
            transactionCopy.type = transaction.type;
            transactionCopy.number = transaction.number;
            transactionCopy.date = transaction.date;
            transactionCopy.party = Party.CopyFrom(transaction.party);
            transactionCopy.items = TransactionItem.CopyAllFrom(transaction.items);
            transactionCopy.received = transaction.received;
            transactionCopy.due = transaction.balance;
        }
        return transactionCopy;
    }
}