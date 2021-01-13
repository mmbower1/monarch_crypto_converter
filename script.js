// currency data
const currencyEl_one = document.getElementById('currency-one');
const amountEl_one = document.getElementById('amount-one');
const currencyEl_two = document.getElementById('currency-two');
const amountEl_two = document.getElementById('amount-two');
const rate = document.getElementById('rate');
const marquee = document.getElementById('marquee');

// clock data
const hour = document.querySelector('.hour');
const minute = document.querySelector('.minute');
const second = document.querySelector('.second');
const time = document.querySelector('.time');
const date = document.querySelector('.date');
const toggle = document.querySelector('.toggle');
const ampm = hour <= 12 ? 'AM' : 'PM';
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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

// clock functionality
function setTime() {
  const currentTime = new Date();
  const currentDate = currentTime.getDate();
  const month = currentTime.getMonth();
  const day = currentTime.getDay();
  const hours = currentTime.getHours();
  const hoursForClock = hours % 12;
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();

  hour.style.transform = 
    `translate(-50%, -100%) rotate(${scale(hoursForClock, 0, 11, 0, 360)}deg)`;
  minute.style.transform = 
    `translate(-50%, -100%) rotate(${scale(minutes, 0, 59, 0, 360)}deg)`;
  second.style.transform = 
    `translate(-50%, -100%) rotate(${scale(seconds, 0, 59, 0, 360)}deg)`;

  time.innerHTML = `${hoursForClock}: ${minutes < 10 ? `0${minutes}` : minutes} ${ampm}`;
  date.innerHTML = `${days[day]}, ${months[month]} <span class="circle">${currentDate}</span>`;
}
// clock scale func from stack overflow
const scale = (num, in_min, in_max, out_min, out_max) => {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

// commas for large numbers
function numberWithCommas(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

setTime();
setInterval(setTime, 1000);