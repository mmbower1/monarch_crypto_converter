const currencyEl_one = document.getElementById('currency-one');
const amountEl_one = document.getElementById('amount-one');

const currencyEl_two = document.getElementById('currency-two');
const amountEl_two = document.getElementById('amount-two');
const rate = document.getElementById('rate');
// const swap = document.getElementById('swap');
// swap.addEventListener('click', () => {
//   const temp = currencyEl_one.value;
//   currencyEl_one.value = currencyEl_two.value;
//   currencyEl_two.value = temp;
//   calculate();
// });

currencyEl_one.addEventListener('change', calculate);
amountEl_one.addEventListener('input', function(){calculate("one")});
currencyEl_two.addEventListener('change', calculate);
amountEl_two.addEventListener('input', function(){calculate("two")});

// fetch exchange rates and update DOM
function calculate(num) {

  const currencyOne = currencyEl_one.value;
  const currencyTwo = currencyEl_two.value;
  console.log(" ");
  console.log(" ");
  console.log("==============================================");
  console.log("num: " + num);
  console.log("currencyOne: " + currencyOne);
  console.log("currencyTwo: " + currencyTwo);
  fetch(`https://api.exchangerate-api.com/v4/latest/${currencyOne}`)
    .then(res => res.json())
    .then(data => {
      // console.log('fiat data.rates: ', data.rates);
      for (const [key, value] of Object.entries(data.rates)) {
       //console.log(`key: ${key}, value: ${value}`);
        if (currencyOne === key) {
          //console.log("Inside if statement");
          //console.log("currencyOne === key " + currencyOne === key);
          //let currRate = 
          rate.innerText = `1 ${currencyTwo} = ${value} ${currencyOne}`;
          // Calcualte Here
          console.log("value: " + value);
          console.log("amount one raw: " + amountEl_one.value );
          console.log("amount two raw: " + amountEl_two.value );
          
          // TODO
          //amountEl_one.value = (amountEl_two.value * value).toFixed(2);
          //amountEl_two.value = (amountEl_one.value * value).toFixed(2);
        }
      }
    })
    
    // TODO
    fetchCMC(num);
    console.log(" ");
    console.log(" ");
    console.log(" ");
    console.log(" ");
    //fetchMT()
}

// fetch cryptocurrency rates
function fetchCMC(num) {
  var apiKey = {
    key: '3e63059f-2e72-4fcb-ac0d-1663f970caaf'
  }
  request('GET', 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=' + apiKey.key)
    .then((res) => {
      var data = JSON.parse(res.target.response);
      // console.log('data.data: ', data.data);
      const currencyOne = currencyEl_one.value;
      const currencyTwo = currencyEl_two.value;
      for (var i = 0; i < data.data.length; i++) {
        const price = data.data[i].quote.USD.price;
        const symbol = data.data[i].symbol;
        // console.log('crypto price[i]: ', price);
        // console.log('crypto symbol: ', symbol);
        // console.log('');
        if (currencyTwo === symbol) {
          console.log("updating crypto rate...");
          rate.innerText = `1 ${currencyTwo} = ${price} ${currencyOne}`;
          console.log("AFTER updating crypto rate...");
          // TODO 
          // Determine which input box was changed and then calculate accordingly
          // Get the value of input box one and save to temp variable
          // Get the value of input box two and save to temp variable
          let countryValue = amountEl_one.value;
          let cryptoValue = amountEl_two.value;
          console.log("rate: " + price );
          console.log("countryValue: " + countryValue );
          console.log("cryptoValue: " + cryptoValue);
          if(num == "one"){
            console.log("Changing country currency, value: "+ amountEl_one.value);
            //console.log("moneyRate: "+ moneyRate);
            console.log("price: "+ price);
            amountEl_two.value = (amountEl_one.value / price).toFixed(9);
          }else {
            amountEl_one.value = (amountEl_two.value * price).toFixed(2);
          }
          //amountEl_one.value = (amountEl_two.value * price).toFixed(2);
          //amountEl_one.value = (amountEl_two.value * price).toFixed(2);
          //amountEl_two.value = (amountEl_one.value * moneyRate).toFixed(2);
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
function fetchMT() {
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
