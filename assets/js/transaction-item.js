import { BaseClass } from "./common.js";
import { Item } from "./item.js";

export class TransactionItem extends BaseClass {
    constructor() {
        super();
        this.item = null;
        this.quantity = 0;
    }

    static CopyFrom(transactionItem) {
        let transactionItemCopy = new TransactionItem();
        if (transactionItem) {
            transactionItemCopy.item = Item.CopyFrom(transactionItem.item);
            transactionItemCopy.quantity = transactionItem.quantity;
        }
        return transactionItemCopy;
    }
}