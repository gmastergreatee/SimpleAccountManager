import { Item } from './item.js';
import { Party } from './party.js';
import { Transaction } from './transaction.js';
import * as Store from './localstore.js';
import { TransactionItem } from './transaction-item.js';

// vuejs logic
let app = new Vue({
    el: '#vuejify',
    data() {
        return {
            menus: [
                'Home',
                'Parties',
                'Items',
            ],

            newParty: new Party(),
            newItem: new Item(),
            newTransaction: new Transaction(),

            items: [],
            selectedItem: null,

            parties: [],
            selectedParty: null,

            transactions: [],

            tabIndex: 5,
            majorTabIndex: 0,
            fullscreenView: true,

            selectedPartyForAddSale: null,
            itemsForAddSale: [],
            receivedAmountForSale: 0,
            dateForAddSale: '',
        };
    },
    methods: {
        debugCode() {
            this.selectedPartyForAddSale = this.parties[0];
            this.itemsForAddSale.push(
                TransactionItem.createFrom(this.items[0])
            );
            this.itemsForAddSale.push(
                TransactionItem.createFrom(this.items[1])
            );
        },
        setTabIndex(index, fs = false) {
            if (fs) {
                this.fullscreenView = true;
                this.majorTabIndex = this.tabIndex;
            } else {
                this.fullscreenView = false;
            }
            this.tabIndex = index;
            switch (this.tabIndex) {
                case 5:
                    this.addSaleInit();
                    break;
            }
        },
        backClick() {
            this.tabIndex = this.majorTabIndex;
            this.fullscreenView = false;
        },

        //#region Party related
        saveParty() {
            if (!this.newParty.IsValid) {
                return;
            }
            if (!this.newParty.id) {
                this.newParty.id = Party.GetId;
            }
            this.parties.push(this.newParty);
            this.newParty = new Party();
            Store.setData('parties', JSON.stringify(this.parties));
            this.backClick();
        },
        selectParty(party) {
            this.selectedParty = party;
        },
        //#endregion

        //#region Item related
        saveItem() {
            if (!this.newItem.IsValid) {
                return;
            }
            if (!this.newItem.id) {
                this.newItem.id = Item.GetId;
            }
            this.newItem.price = parseFloat(this.newItem.price);
            this.items.push(this.newItem);
            this.newItem = new Item();
            Store.setData('items', JSON.stringify(this.items));
            this.backClick();
        },
        selectItem(item) {
            this.selectedItem = item;
        },
        //#endregion

        //#region Sale related
        addSaleInit() {
            let today = new Date();
            this.dateForAddSale = `${today.getFullYear()}-${padLeft((today.getMonth() + 1).toString(), 2, '0')}-${padLeft(today.getDate().toString(), 2, '0')}`
        },
        selectPartyForAddSale(party) {
            this.selectedPartyForAddSale = party;
        },
        reselectPartyForAddSale() {
            this.selectedPartyForAddSale = null;
            this.itemsForAddSale = [];
        },
        selectItemForAddSale(item) {
            this.itemsForAddSale.push(
                TransactionItem.createFrom(item)
            );
        },
        receivedAmountForSale_Changed() {
            let recAmt = parseFloat(this.receivedAmountForSale);
            if (this.totalForAddSale < recAmt) {
                this.receivedAmountForSale = this.totalForAddSale;
            }
        },
        removeItemFromSale(item) {
            let index = this.itemsForAddSale.indexOf(item);
            this.itemsForAddSale.splice(index, 1);
        },
        generateSaleReceipt() {
            let transactionNo = this.transactions.length <= 0 ? 0 : Math.max(this.transactions.reduce(i => i.number), 0);
            if (isNaN(transactionNo)) {
                transactionNo = 0;
            }
            let transaction = Transaction.From(
                this.dateForAddSale,
                this.selectedPartyForAddSale,
                this.itemsForAddSale,
                this.receivedAmountForSale,
                'Sale',
                transactionNo + 1,
            );
            console.log(transaction);
            this.transactions.push(transaction);
            Store.setData('transactions', JSON.stringify(this.transactions));

            this.selectedPartyForAddSale = null;
            this.itemsForAddSale = [];
            this.receivedAmountForSale = 0;
            this.dateForAddSale = '';

            this.backClick();
        },
        //#endregion
    },
    computed: {
        totalForAddSale() {
            return this.itemsForAddSale.reduce((a, b) => { a += b.total; return a; }, 0);
        },
        totalForAddSaleFormatted() {
            return `₹ ${this.totalForAddSale.toFixed(2)}`;
        },
        dueForAddSale() {
            let recAmt = parseFloat(this.receivedAmountForSale);
            return `₹ ${isNaN(recAmt) ? 0 : (this.totalForAddSale - recAmt)}`;
        },
    },
    mounted() {
        let items = JSON.parse(Store.getData('items'));
        this.items = Item.CopyAllFrom(items);

        let parties = JSON.parse(Store.getData('parties'));
        this.parties = Party.CopyAllFrom(parties);

        let transactions = JSON.parse(Store.getData('transactions'));
        this.transactions = Transaction.CopyAllFrom(transactions);

        this.debugCode();
    }
});

// jquery event bindings
$(document).ready(function () {
    $('.numeric').on('paste', function (event) {
        let copiedText = event.originalEvent.clipboardData.getData('Text');
        if (copiedText.match(/[^\d\.]/)) {
            event.preventDefault();
        }
        if (copiedText.indexOf('.') >= 0 && event.target.value.indexOf('.') >= 0) {
            event.preventDefault();
        }
    });

    $('.numeric').on('keypress', function (event) {
        if (event.which != 46 && (event.which < 48 || event.which > 58)) {
            return false;
        } else if (event.which == 46 && event.target.value.indexOf('.') >= 0) {
            return false;
        }
    });
});

// utils
function padLeft(text, length, char) {
    let temp = text;
    while (temp.length < length) {
        temp = char + temp;
    }
    return temp;
}