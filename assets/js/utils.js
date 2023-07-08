export class Utils {
    static PadLeft(text, length, char) {
        let temp = text.toString();
        while (temp.length < length) {
            temp = char + temp;
        }
        return temp;
    }
    static ExportPNG(node, imageName = 'image.png') {
        domtoimage.toPng(node, { quality: 0.95 })
            .then(function (dataUrl) {
                var link = document.createElement('a');
                link.download = imageName;
                link.href = dataUrl;
                link.click();
            });
    }
    static FormatCurrency(number) {
        let num = parseFloat(number);
        if (isNaN(num)) {
            num = 0;
        }
        return `₹ ${num.toFixed(2)}`;
    }
}