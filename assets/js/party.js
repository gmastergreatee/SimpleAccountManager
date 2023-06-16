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

// export class Party {
//     constructor() {
//         this.id = 0;
//         this.name = '';
//         this.phone = '';
//         this.state = '';
//         this.address = '';
//         this.email = '';
//         this.balance = 0;
//     }
// }

// export function IsPartyValid(party) {
//     if (
//         !this.party ||
//         this.party.name == '' ||
//         this.party.phone.length != 10 ||
//         this.party.state == '' ||
//         this.party.email == '' ||
//         this.party.address == ''
//     ) {
//         return false;
//     }
//     return true;
// }

// export function CopyFrom(party) {
//     let partyCopy = new Party();
//     if (party) {
//         partyCopy.id = party.id;
//         partyCopy.name = party.name;
//         partyCopy.phone = party.phone;
//         partyCopy.state = party.state;
//         partyCopy.address = party.address;
//         partyCopy.email = party.email;
//         partyCopy.balance = party.balance;
//     }
//     return partyCopy;
// }

// export function CopyAllFrom(parties) {
//     if (parties && parties.length && parties.length > 0) {
//         return parties.map((party) => {
//             return CopyFrom(party);
//         });
//     }
//     return [];
// }