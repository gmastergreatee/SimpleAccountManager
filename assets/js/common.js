export class BaseClass {
    constructor() { }
    static CopyFrom(stuff) {
        throw new Error("Implement this method in base-class");
    }
    static CopyAllFrom(stuffz) {
        if (stuffz && stuffz.length && stuffz.length > 0) {
            return stuffz.map((stuff) => {
                return this.CopyFrom(stuff);
            });
        }
        return [];
    }
    static get GetMaxId() {
        return crypto.randomUUID();
    }
}