import { Item } from './item.js';
import { Party } from './party.js';
import { Transaction } from './transaction.js';
import * as Store from './localstore.js';

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

            tabIndex: 0,
            majorTabIndex: 0,
            fullscreenView: false,
        };
    },
    methods: {
        setTabIndex(index, fs = false) {
            if (fs) {
                this.fullscreenView = true;
                this.majorTabIndex = this.tabIndex;
            } else {
                this.fullscreenView = false;
            }
            this.tabIndex = index;
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
                this.newParty.id = Party.GetMaxId;
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
                this.newItem.id = Item.GetMaxId;
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


    },
    computed: {

    },
    mounted() {
        let items = JSON.parse(Store.getData('items'));
        this.items = Item.CopyAllFrom(items);

        let parties = JSON.parse(Store.getData('parties'));
        this.parties = Party.CopyAllFrom(parties);

        let transactions = JSON.parse(Store.getData('transactions'));
        this.transactions = Transaction.CopyAllFrom(transactions);
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