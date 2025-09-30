const formatNumberToMoney = (number: number, currency = '') => {
  if (!number || isNaN(number) || Number(number) === 0) {
    return `0${currency}`;
  }

  const array = [];
  let result = '';
  let isNegative = false;

  if (number < 0) {
    isNegative = true;
  }

  const numberString = Math.abs(number).toString();
  if (numberString.length < 3) {
    return numberString + currency;
  }

  let count = 0;
  for (let i = numberString.length - 1; i >= 0; i -= 1) {
    count += 1;
    if (numberString[i] === '.' || numberString[i] === ',') {
      array.push(',');
      count = 0;
    } else {
      array.push(numberString[i]);
    }
    if (count === 3 && i >= 1) {
      array.push('.');
      count = 0;
    }
  }

  for (let i = array.length - 1; i >= 0; i -= 1) {
    result += array[i];
  }

  if (isNegative) {
    result = `-${result}`;
  }

  return result + currency;
};

const formatMoneyToNumber = (money: string, currencyUnit: string) => {
  if (money && money.length > 0) {
    const moneyString = money
      .replace(currencyUnit, '')
      .replace(/,/g, '')
      .replace(/đ/g, '')
      .replace(/\./g, '')
      .replace(/ /g, '');
    const number = Number(moneyString);
    if (isNaN(number)) {
      return 0;
    }
    return number;
  }

  return Number(money);
};

export {formatMoneyToNumber, formatNumberToMoney};
