import { BaseClass } from "./common.js";
import { Item } from "./item.js";
import { Utils } from "./utils.js";

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

    /**
     * Create empty {TransactionItem} from an {Item} object
     * @param {Item} item 
     */
    static createFrom(item) {
        let transactionItem = new TransactionItem();
        transactionItem.item = Item.CopyFrom(item);
        transactionItem.quantity = 0;
        return transactionItem;
    }

    get total() {
        if (this.quantity.toString().trim() == ''){
            return 0;
        }
        return this.item.price * (parseInt(this.quantity));
    }

    get formattedTotal() {
        return Utils.FormatCurrency(this.total);
    }
}