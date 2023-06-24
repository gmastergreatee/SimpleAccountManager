export class Utils {
    static PadLeft(text, length, char) {
        let temp = text.toString();
        while (temp.length < length) {
            temp = char + temp;
        }
        return temp;
    }
}