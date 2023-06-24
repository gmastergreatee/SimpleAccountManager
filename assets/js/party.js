import { BaseClass } from "./common.js";


export class Party extends BaseClass {
    constructor(
        id = '',
        name = '',
        phone = '',
        state = '',
        address = '',
        email = '',
        balance = 0
    ) {
        super();
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.state = state;
        this.address = address;
        this.email = email;
        this.balance = balance;
    }

    get IsValid() {
        if (
            this.name == '' ||
            this.phone.length != 10 ||
            this.state == '' ||
            this.email == '' ||
            this.address == ''
        ) {
            return false;
        }
        return true;
    }

    get formattedBalance() {
        return `₹ ${this.balance.toFixed(2)}`;
    }

    static CopyFrom(party) {
        if (!party)
            return new Party();
        let partyCopy = new Party(
            party.id,
            party.name,
            party.phone,
            party.state,
            party.address,
            party.email,
            party.balance
        );
        return partyCopy;
    }
}
