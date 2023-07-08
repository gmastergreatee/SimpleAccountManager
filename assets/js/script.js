import { Item } from './item.js';
import { Party } from './party.js';
import { Transaction } from './transaction.js';
import * as Store from './localstore.js';
import { TransactionItem } from './transaction-item.js';
import { Utils } from './utils.js';

let debugMode = true;

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

            items: [],
            selectedItem: null,

            parties: [],
            selectedParty: null,

            transactions: [],
            nextTransactionId: 1,

            tabIndex: 0,
            majorTabIndex: 0,
            fullscreenView: false,

            selectedPartyForAddSale: null,
            itemsForAddSale: [],
            receivedAmountForSale: 0,
            dateForAddSale: '',

            selectedTransaction: null,
        };
    },
    methods: {
        debugCode() {
            this.setTabIndex(6, true);
            this.selectedTransaction = this.transactions[0];
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
                case 3:
                    this.addPartyInit();
                case 4:
                    this.addItemInit();
                case 5:
                    this.addSaleInit();
                    break;
            }
        },
        backClick() {
            this.tabIndex = this.majorTabIndex;
            this.fullscreenView = false;
        },
        formatCurrency(num) {
            return Utils.FormatCurrency(num);
        },
        showReceipt(transaction) {
            this.selectedTransaction = transaction;
            this.setTabIndex(6, true);
        },

        //#region Party related
        addPartyInit() {
            if (this.newParty.id == '') {
                this.newParty = new Party();
            }
        },
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
        exportTransactions() {
            Utils.ExportPNG($('#party-transactions')[0]);
        },
        //#endregion

        //#region Item related
        addItemInit() {
            if (this.newItem.id == '') {
                this.newItem = new Item();
            }
        },
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
            this.dateForAddSale = `${today.getFullYear()}-${Utils.PadLeft((today.getMonth() + 1).toString(), 2, '0')}-${Utils.PadLeft(today.getDate().toString(), 2, '0')}`
            this.selectedPartyForAddSale = null;
            this.itemsForAddSale = [];
            this.receivedAmountForSale = 0;
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
                this.receivedAmountForSale = this.totalForAddSale.toFixed(2);
            }
        },
        removeItemFromSale(item) {
            let index = this.itemsForAddSale.indexOf(item);
            this.itemsForAddSale.splice(index, 1);
        },
        generateSaleReceipt() {
            let transaction = Transaction.From(
                this.dateForAddSale,
                this.selectedPartyForAddSale,
                this.itemsForAddSale,
                parseFloat(this.receivedAmountForSale),
                'Sale',
                this.nextTransactionId,
            );
            this.selectedPartyForAddSale.balance = transaction.party.balance;
            this.transactions.push(transaction);
            this.nextTransactionId++;

            Store.setData('transactions', JSON.stringify(this.transactions));
            Store.setData('parties', JSON.stringify(this.parties));

            this.majorTabIndex = 1;
            this.selectedParty = this.selectedPartyForAddSale;
            this.showReceipt(transaction);
        },
        exportReceipt() {
            Utils.ExportPNG($('#transaction-receipt')[0]);
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
        showGenerateSaleButton() {
            return this.itemsForAddSale.length > 0 &&
                this.totalForAddSale > 0 &&
                parseFloat(
                    this.receivedAmountForSale.length == 0
                        ? 0 : this.receivedAmountForSale
                ) >= 0 &&
                this.dateForAddSale != '';
        },
        transactionsForSelectedParty() {
            if (!this.selectedParty) {
                return [];
            }
            return this.transactions.filter(i => i.party.id == this.selectedParty.id);
        },
    },
    mounted() {
        let items = JSON.parse(Store.getData('items'));
        this.items = Item.CopyAllFrom(items);

        let parties = JSON.parse(Store.getData('parties'));
        this.parties = Party.CopyAllFrom(parties);

        let transactions = JSON.parse(Store.getData('transactions'));
        this.transactions = Transaction.CopyAllFrom(transactions);

        if (this.transactions.length > 0) {
            this.nextTransactionId = this.transactions.reduce((a, b) => {
                if (a > b.number) return a;
                return b.number;
            }, 0) + 1;
        }

        if (debugMode) {
            this.debugCode();
        }
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
