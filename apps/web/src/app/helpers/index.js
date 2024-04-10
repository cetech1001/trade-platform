import {setMessage} from "../store/actions/message";
import _ from 'lodash';

export function kFormatter(num) {
    return Math.abs(Number(num)) > 999
        ? Math.sign(num) * ((Math.abs(num)/1000).toFixed(1)) + 'k'
        : Math.sign(num)*Math.abs(num)
}

export function formatCurrency(amount, currency = "USD") {
    return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency,
    }).format(amount);
}

export function copyToClipboard(text, dispatch) {
    navigator.clipboard.writeText(text)
        .then(() => {
            dispatch(setMessage({
                show: true,
                type: 'success',
                message: 'Text copied',
            }));
        })
        .catch(() => {
            dispatch(setMessage({
                show: true,
                type: 'danger',
                message: 'Failed to copy text',
            }));
        });
}

export function formatDate(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) {
        month = '0' + month;
    }
    if (day.length < 2) {
        day = '0' + day;
    }

    return [year, month, day].join('-');
}

export function displayDate(date) {
    return new Intl.DateTimeFormat("en-GB", {
        year: "numeric",
        month: "long",
        day: "2-digit"
    }).format(new Date(date));
}

export function displayTime(date) {
    return new Intl.DateTimeFormat("en-GB", {
        hour: "numeric",
        minute: "numeric",
    }).format(new Date(date));
}

export function firstLetterToUpper(word) {
    const letters = word.split('');
    return letters[0] && letters[0].toUpperCase() + (letters.shift() && letters.reduce((acc, curr) => acc + curr, ''));
}

export function filterByStatus(items, status) {
    return items.filter(v => status === 'all' || v.status === status);
}

export function filterByUserID(items, userID) {
    return items.filter(v => v.userID === userID);
}

export function isArrayEqual(x, y) {
    return x.length === y.length && _(x).differenceWith(y, _.isEqual).isEmpty();
}

export function getCoinAmount(amount, currency, dispatch) {
    return fetch(`https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=${currency}`)
        .then(response => response.json())
        .then(data => {
            if (data[currency]) {
                return parseFloat(data[currency]) * parseFloat(amount);
            }
            return amount;
        })
        .catch(() => {
            dispatch(setMessage({
                type: 'danger',
                show: true,
                message: 'Could not fetch USD/' + currency + ' exchange rate',
            }));
        });
}

function testWhite(x) {
    const white = new RegExp(/^\s$/);
    return white.test(x.charAt(0));
}

export function wordWrap(str, maxWidth) {
    str = String(str);
    let newLineStr = "\n";
    let res = '';

    while (str.length > maxWidth) {
        let found = false;
        for (let i = maxWidth - 1; i >= 0; i--) {
            if (testWhite(str.charAt(i))) {
                res = res + [str.slice(0, i), newLineStr].join('');
                str = str.slice(i + 1);
                found = true;
                break;
            }
        }
        if (!found) {
            res += [str.slice(0, maxWidth), newLineStr].join('');
            str = str.slice(maxWidth);
        }
    }

    return res + str;
}

export function setRef() {
    const ref = new URLSearchParams(window.location.search).get('ref');
    if (ref) {
        sessionStorage.setItem('ref', ref);
    }
}

export const objectToQueryString = params =>
    Object.entries(params).map(([key, value]) => `${key}=${value}`).join('&');