const currencyEl_one = document.getElementById('currency-one');
const amountEl_one = document.getElementById('amount-one');

const currencyEl_two = document.getElementById('currency-two');
const amountEl_two = document.getElementById('amount-two');
const rate = document.getElementById('rate');
const swap = document.getElementById('swap');

currencyEl_one.addEventListener('change', calculate);
amountEl_one.addEventListener('input', calculate);
currencyEl_two.addEventListener('change', calculate);
amountEl_two.addEventListener('input', calculate);
swap.addEventListener('click', () => {
  const temp = currencyEl_one.value;
  currencyEl_one.value = currencyEl_two.value;
  currencyEl_two.value = temp;
  calculate();
  // calculateCrypto();
})

// fetch exchange rates and update DOM
function calculate() {
  const currencyOne = currencyEl_one.value;
  const currencyTwo = currencyEl_two.value;
  fetch(`https://api.exchangerate-api.com/v4/latest/${currencyOne}`)
    .then(res => res.json())
    .then(data => {
      console.log('data: ' + JSON.stringify(data));
      const moneyRate = data.rates[currencyOne];
      console.log('fiat moneyRate: ', moneyRate);
      rate.innerText = `1 ${currencyOne} = ${moneyRate} ${currencyTwo}`;
      amountEl_two.value = (amountEl_one.value * moneyRate).toFixed(2);
    })
}

// fetch cryptocurrency rates
function fetchCrypto() {
  var apiKey = {
    key: '3e63059f-2e72-4fcb-ac0d-1663f970caaf'
  }
  request('GET', 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=' + apiKey.key)
    .then((res) => {
      var data = JSON.parse(res.target.response);
      const btc = data.data[0].quote.USD.price;
      const eth = data.data[1].quote.USD.price;
      const moneyRate = btc;
      const currencyOne = currencyEl_one.value;
      const currencyTwo = currencyEl_two.value;
      console.log('data.data: ', data.data)
      console.log('btc: ', data.data[0].quote.USD.price);
      console.log('eth', data.data[1].quote.USD.price);
      console.log('crypto moneyRate: ', moneyRate);
      rate.innerText = `1 ${currencyTwo} = ${moneyRate} ${currencyOne}`;
      amountEl_one.value = (amountEl_two.value * moneyRate).toFixed(2);
    }).catch((err) => err);
  function request(method, url) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.open(method, url);
      xhr.onload = resolve;
      xhr.onerror = reject;
      xhr.send();
    });
  }
}

fetchCrypto();
calculate();
