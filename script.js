const currencyEl_one = document.getElementById('currency-one');
const amountEl_one = document.getElementById('amount-one');

const currencyEl_two = document.getElementById('currency-two');
const amountEl_two = document.getElementById('amount-two');
const rate = document.getElementById('rate');

currencyEl_one.addEventListener('change', calculate);
amountEl_one.addEventListener('input', () => calculate("one"));
currencyEl_two.addEventListener('change', calculate);
amountEl_two.addEventListener('input', () => calculate("two"));

let currentRate = 0;

calculate();

// fetch exchange rates and update DOM
function calculate(num) {
  const currencyOne = currencyEl_one.value;
  const currencyTwo = currencyEl_two.value;
  // fetch(`https://api.exchangerate-api.com/v4/latest/${currencyOne}`)
  fetch(`https://prime.exchangerate-api.com/v5/dad7a42d087d1d8dfe8197e2/latest/${currencyOne}`)
    .then(res => res.json())
    .then(data => {
      //console.log('fiat data: ', data.conversion_rates);
      for (const [key, value] of Object.entries(data.conversion_rates)) {
        //console.log(`key: ${key}, value: ${value}`);
        if ("USD" === key) {
          console.log("MATCH")
          console.log(`key: ${key}, value: ${value}`);
          currentRate = value;
          console.log("Current rate is",currentRate)
          //rate.innerText = `1 ${currencyTwo} = ${value} ${currencyOne}`;
        }
      }
    })
    console.log("currencyTwo", currencyEl_two.value);
    if (currencyEl_two.value == "MT"){
      fetchMT(num);
    } else {
      fetchCMC(num);
    }
}

// fetch cryptocurrency rates
function fetchCMC(num) {
  console.log("fetchCMC num", num);
  var apiKey = {
    key: '3e63059f-2e72-4fcb-ac0d-1663f970caaf'
  }
  request('GET', 'http://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=' + apiKey.key)
    .then((res) => {
      var data = JSON.parse(res.target.response);
      // console.log('data.data: ', data.data);
      const currencyOne = currencyEl_one.value;
      const currencyTwo = currencyEl_two.value;
      for (var i = 0; i < data.data.length; i++) {
        let price = data.data[i].quote.USD.price * currentRate;
        const symbol = data.data[i].symbol;

        if (currencyTwo === symbol) {
          console.log(" ");
          console.log(" ");
          console.log("PRICE in LOCAL CURRENCY: ", price);
          console.log("Current Rate: ", currentRate);
          console.log(" ");
          console.log(" ");
          rate.innerText = `1 ${currencyTwo} = ${price} ${currencyOne}`;
          if (num == "one") {
            amountEl_two.value = (amountEl_one.value / price).toFixed(8);
          } else {
            amountEl_one.value = (amountEl_two.value * price).toFixed(2);
          }
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
function fetchMT(num) {
  const currencyOne = currencyEl_one.value;
  const currencyTwo = currencyEl_two.value;
  fetch('https://min-api.cryptocompare.com/data/pricemulti?fsyms=MT&tsyms=USD,EUR')
    .then(res => res.json())
    .then(data => {
      console.log('crypto compare', data.MT.USD);
      const mt = data.MT.USD;
      rate.innerText = `1 ${currencyTwo} = ${mt} ${currencyOne}`;
      console.log("Changing input boxes...");
      console.log("Box one to: ", (amountEl_two.value * mt).toFixed(8));
      console.log("Box two to: ", (amountEl_one.value / mt).toFixed(8));
      if (num == "one") {
        amountEl_two.value = (amountEl_one.value / mt).toFixed(8);
      } else {
        amountEl_one.value = (amountEl_two.value * mt).toFixed(8);
      }
      return mt;
    }
  )
}
