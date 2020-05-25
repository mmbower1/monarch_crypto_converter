const currencyEl_one = document.getElementById('currency-one');
const amountEl_one = document.getElementById('amount-one');

const currencyEl_two = document.getElementById('currency-two');
const amountEl_two = document.getElementById('amount-two');
const rate = document.getElementById('rate');

const marquee = document.getElementById('marquee');

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
  fetch(`https://prime.exchangerate-api.com/v5/dad7a42d087d1d8dfe8197e2/latest/${currencyOne}`)
    .then(res => res.json())
    .then(data => {
      console.log('fiat data: ', data);
      for (const [key, value] of Object.entries(data.conversion_rates)) {
        if ("USD" === key) {
          //console.log(`key: ${key}, value: ${value}`);
          currentRate = value;
          console.log("Current rate is: ", currentRate)
          //rate.innerText = `1 ${currencyTwo} = ${value} ${currencyOne}`;
        }
        marquee.innerText = `Coin Market Cap Prices: {${JSON.stringify(data.conversion_rates)}}`
      }      
      if (currencyEl_two.value == "MT") {
        fetchMT(num);
      } else {
        fetchCMC(num);
      }
    })
    
}

// fetch cryptocurrency rates
function fetchCMC(num) {
  console.log("fetchCMC num", num);
  var apiKey = {
    key: '3e63059f-2e72-4fcb-ac0d-1663f970caaf'
  }
  request('GET', 'https://cors-anywhere.herokuapp.com/https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=' + apiKey.key)
    .then((res) => {
      // console.log('res: ', res);
      var data = JSON.parse(res.target.response);
      console.log('data.data: ', data.data);
      const currencyOne = currencyEl_one.value;
      const currencyTwo = currencyEl_two.value;
      for (var i = 0; i < data.data.length; i++) {
        const symbol = data.data[i].symbol;
        if (currencyTwo === symbol) {
          let dollarPrice = data.data[i].quote.USD.price;
          let convertedPrice = (dollarPrice / parseFloat(currentRate));
          let price = dollarPrice * currentRate;
          let formattedConvertedPrice = numberWithCommas(convertedPrice);
          rate.innerText = `1 ${currencyTwo} = ${formattedConvertedPrice} ${currencyOne}`;
          if (num == "one") {
            amountEl_two.value = (amountEl_one.value / convertedPrice).toFixed(8);
          } else {
            amountEl_one.value = (amountEl_two.value * convertedPrice).toFixed(2);
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
      const mt = data.MT.USD;
      rate.innerText = `1 ${currencyTwo} = ${mt} ${currencyOne}`;
      if (num == "one") {
        amountEl_two.value = (amountEl_one.value / mt).toFixed(8);
      } else {
        amountEl_one.value = ((amountEl_two.value * mt) * 1.68).toFixed(8);
      }
      return mt;
    }
  )
}

// commas for large numbers
function numberWithCommas(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}