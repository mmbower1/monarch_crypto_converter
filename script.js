const currencyEl_one = document.getElementById('currency-one');
const amountEl_one = document.getElementById('amount-one');

const currencyEl_two = document.getElementById('currency-two');
const amountEl_two = document.getElementById('amount-two');
const rate = document.getElementById('rate');

currencyEl_one.addEventListener('change', calculate);
amountEl_one.addEventListener('input', calculate);
currencyEl_two.addEventListener('change', calculate);
amountEl_two.addEventListener('input', calculate);

// fetch exchange rates and update DOM
function calculate() {
  const currencyOne = currencyEl_one.value;
  const currencyTwo = currencyEl_two.value;
  fetch(`https://api.exchangerate-api.com/v4/latest/${currencyOne}`)
    .then(res => res.json())
    .then(data => {
      // console.log('fiat data.rates: ', data.rates);
      for (const [key, value] of Object.entries(data.rates)) {
        // console.log(`key: ${key}, value: ${value}`);
        if (currencyOne === key) {
          rate.innerText = `1 ${currencyTwo} = ${value} ${currencyOne}`;
          amountEl_one.value = (amountEl_two.value * value).toFixed(2);
          amountEl_two.value = (amountEl_one.value * value).toFixed(2);
        }
      }
    })
    // calling this allows the rate element work
    fetchCMC();
    fetchCryptoCompare()
}

// fetch cryptocurrency rates
function fetchCMC() {
  var apiKey = {
    key: '3e63059f-2e72-4fcb-ac0d-1663f970caaf'
  }
  request('GET', 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=' + apiKey.key)
    .then((res) => {
      var data = JSON.parse(res.target.response);
      console.log('data.data: ', data.data);
      const currencyOne = currencyEl_one.value;
      const currencyTwo = currencyEl_two.value;
      for (var i = 0; i < data.data.length; i++) {
        const price = data.data[i].quote.USD.price;
        const symbol = data.data[i].symbol;
        // console.log('crypto price[i]: ', price);
        // console.log('crypto symbol: ', symbol);
        // console.log('');
        if (currencyTwo === symbol) {
          rate.innerText = `1 ${currencyTwo} = ${price} ${currencyOne}`;
          amountEl_one.value = (amountEl_two.value * price).toFixed(2);
          amountEl_two.value = (amountEl_one.value * moneyRate).toFixed(2);
        }
      }
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

// get MT
function fetchCryptoCompare() {
  const currencyOne = currencyEl_one.value;
  const currencyTwo = currencyEl_two.value;
  fetch('https://min-api.cryptocompare.com/data/pricemulti?fsyms=MT&tsyms=USD,EUR')
    .then(res => res.json())
    .then(data => {
      console.log('crypto compare', data.MT.USD);
      const mt = data.MT.USD;
      if (currencyTwo === 'MT') {
        rate.innerText = `1 ${currencyTwo} = ${mt} ${currencyOne}`;
        amountEl_one.value = (amountEl_two.value * mt).toFixed(2);
        amountEl_two.value = (amountEl_one.value * mt).toFixed(2);
      }
    }
  )
}

calculate();
