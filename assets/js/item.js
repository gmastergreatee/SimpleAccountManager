import { BaseClass } from "./common.js";

export class Item extends BaseClass {
    constructor() {
        super();
        this.id = '';
        this.name = '';
        this.price = 0;
    }
    static CopyFrom(item) {
        let itemCopy = new Item();
        if (item) {
            itemCopy.id = item.id;
            itemCopy.name = item.name;
            itemCopy.price = item.price;
        }
        return itemCopy;
    }
    get formattedPrice() {
        return `₹ ${this.price.toFixed(2)}`;
    }
    get IsValid() {
        if (
            this.name == '' ||
            parseFloat(this.price) <= 0
        ) {
            return false;
        }
        return true;
    }
}