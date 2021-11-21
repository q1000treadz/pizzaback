import Catalog from '../entity/catalog';

function applyDiscount(
  catalog: Array<Catalog>,
  order: Array<{ itemId: number, count: number }>,
  birthday: Date | undefined,
  summ: number,
) : number {
  const pizzasPriceArray: number[] = [];
  let colaNumber = 0;
  let colaPrice = 0;
  let newSumm = summ;
  for (let i = 0; i < order.length; i++) {
    const obj = catalog.find((catalogElem) => catalogElem.id === order[i]!.itemId);
    if (obj !== undefined) {
      if (obj.type === 'pizza') {
        for (let j = 0; j < order[i].count; j++) {
          pizzasPriceArray.push(obj.price);
        }
      } else if (obj.type === 'additional' && obj.title === 'cola') {
        colaNumber++;
        colaPrice = obj.price;
      }
    }
  }
  pizzasPriceArray.sort((a, b) => a - b);
  for (let i = 0; i < Math.floor(pizzasPriceArray.length / 4); i++) {
    newSumm -= Math.floor(pizzasPriceArray[i] / 2);
  }
  newSumm -= (Math.min(Math.floor(pizzasPriceArray.length / 2), colaNumber) * colaPrice);
  if (birthday !== undefined) {
    const dateNow = new Date(Date.now());
    if (birthday.getDate() === dateNow.getDate() && birthday.getMonth() === dateNow.getMonth()) {
      newSumm = Math.ceil(newSumm * 0.85);
    }
  }
  return summ - newSumm;
}
function calculatePrice(
  catalog: Array<Catalog>,
  order: Array<{ itemId: number, count: number }>,
  birthday: (Date | undefined),
) : { summ: number, discount: number } {
  let summ = 0;
  for (let i = 0; i < order.length; i++) {
    const obj = catalog.find((catalogElem) => catalogElem.id === order[i]!.itemId);
    if (obj !== undefined) {
      summ += (obj!.price * order[i]!.count);
    }
  }
  const discount = applyDiscount(catalog, order, birthday, summ);
  return { summ, discount };
}

export { applyDiscount, calculatePrice };
