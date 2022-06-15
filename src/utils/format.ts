import Decimal from 'decimal.js'

/*
format a string|number to a string without scientific notation
*/
export function noScifiFormat(x: number | string): string {
    if (!x) return ''
    if (Math.abs(+x) < 1.0) {
        const e = parseInt(x.toString().split('e-')[1], 10)
        if (e) {
            const a = new Decimal(10).pow(new Decimal(e).minus(1).valueOf()).valueOf()
            x = new Decimal(x).mul(a).valueOf()
            x = `0.${new Array(e).join('0')}${x.toString().substring(2)}`
        }
    } else {
        let e = parseInt(x.toString().split('+')[1], 10)
        if (e > 20) {
            e -= 20
            x = +x / 10 ** e
            x = x.toString() + new Array(e + 1).join('0')
        }
    }
    return x.toString()
}

export function toThousands(val: number | string): string {
    if (!val) return ''
    const str = `${val}`
    return str.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
}

export function bankFormat(val: string): string {
    if (!val) return ''
    const str = `${val}`
    return str
        .replace(/[^\dA-Z]/g, '')
        .replace(/(.{4})/g, '$1 ')
        .trim()
}
