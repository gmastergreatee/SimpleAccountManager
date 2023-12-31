import { BaseClass } from "./common.js";
import { Party } from "./party.js";
import { TransactionItem } from "./transaction-item.js"
import { Utils } from './utils.js';

export class Transaction extends BaseClass {
    constructor() {
        super();
        this.id = '';
        this.type = '';
        this.number = '';
        this.date = '';
        this.party = null;
        this.items = [];
        this.balance = 0;
        this.received = 0;
        this.due = 0;
    }

    get totalItemCount() {
        return this.items.map(i => i.quantity)
            .reduce((a, b) => {
                return a + parseFloat(b);
            }, 0);
    }

    get totalAmount() {
        if (this.type != 'Sale') {
            return this.balance;
        }
        return this.items.reduce((a, b) => {
            return a + b.item.price;
        }, 0);
    }

    get formattedTotalAmount() {
        return Utils.FormatCurrency(this.totalAmount);
    }

    get formattedPaid() {
        return Utils.FormatCurrency(this.received);
    }

    get formattedDue() {
        return Utils.FormatCurrency(this.due);
    }

    get formattedDate() {
        let curDate = new Date(this.date);
        return Utils.FormatDate(curDate);
    }

    static From(date, party, items, received, type, receiptNo, balance = 0) {
        let transaction = new Transaction();
        transaction.id = this.GetId;
        transaction.type = type;
        transaction.number = receiptNo;
        transaction.date = date;
        transaction.party = Party.CopyFrom(party);
        transaction.items = TransactionItem.CopyAllFrom(items);
        transaction.balance = balance;
        transaction.received = received;
        let total = balance;
        if (items && items.length > 0) {
            total = items.map((a) => {
                return parseFloat(a.quantity) * parseFloat(a.item.price);
            }).reduce((a, b) => {
                a += b;
                return a;
            }, 0)
        }
        transaction.due = total - received;
        transaction.party.balance += transaction.due;
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
            transactionCopy.balance = transaction.balance;
            transactionCopy.received = transaction.received;
            transactionCopy.due = transaction.due;
        }
        return transactionCopy;
    }
}