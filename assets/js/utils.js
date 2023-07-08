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
        return num.toLocaleString('en-IN', {
            maximumFractionDigits: 2,
            style: 'currency',
            currency: 'INR'
        });
    }
    static FormatDate(date) {
        let curDate = date;
        if (!curDate) {
            curDate = new Date();
        }
        return `${Utils.PadLeft(curDate.getDate(), 2, '0')}-${Utils.PadLeft(curDate.getMonth() + 1, 2, '0')}-${curDate.getFullYear()}`
    }
    static FormatDateISO(date) {
        let curDate = date;
        if (!curDate) {
            curDate = new Date();
        }
        return `${curDate.getFullYear()}-${Utils.PadLeft(curDate.getMonth() + 1, 2, '0')}-${Utils.PadLeft(curDate.getDate(), 2, '0')}`
    }
}