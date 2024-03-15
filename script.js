const purchaseBtn = document.getElementById("purchase-btn");
const cashInput = document.getElementById("cash");
const changeDueEl = document.getElementById("change-due");
const price = parseFloat(document.getElementById("price").innerText);
const penniesViewport = document.getElementById("pennies");
const nickelsViewport = document.getElementById("nickels");
const dimesViewport = document.getElementById("dimes");
const quartersViewport = document.getElementById("quarters");
const onesViewport = document.getElementById("ones");
const fivesViewport = document.getElementById("fives");
const tensViewport = document.getElementById("tens");
const twentiesViewport = document.getElementById("twenties");
const hundredsViewport = document.getElementById("hundreds");

let cash;
let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100]
];


const InvalidCashInput = (input) => {
    if (input < price){
        alert("Customer does not have enough money to purchase the item");
        return true;
    }
    if (input === price){
        changeDueEl.innerText = "No change due - customer paid with exact cash";
        return true;
    }
    return false;
}
const getTotalCid = (cid) => {
    return cid.reduce((total,[,amount]) => total + amount,0)
}
const updateCid = () => {
    penniesViewport.innerText = cid[0][1].toFixed(2);
    nickelsViewport.innerText = cid[1][1].toFixed(2);
    dimesViewport.innerText = cid[2][1].toFixed(2);
    quartersViewport.innerText = cid[3][1].toFixed(2);
    onesViewport.innerText = cid[4][1].toFixed(2);
    fivesViewport.innerText = cid[5][1].toFixed(2);
    tensViewport.innerText = cid[6][1].toFixed(2);
    twentiesViewport.innerText = cid[7][1].toFixed(2);
    hundredsViewport.innerText = cid[8][1].toFixed(2);
}
const calculateChange = (change, cid) => {
    const coinValues = {
        'ONE HUNDRED': 100,
        TWENTY: 20,
        TEN: 10,
        FIVE: 5,
        ONE: 1,
        QUARTER: 0.25,
        DIME: 0.1,
        NICKEL: 0.05,
        PENNY: 0.01
      };
      
      const returnedChange = [];
      
      for (let i = cid.length - 1; i >= 0; i--) {
        let [currency, currencyAmount] = cid[i];
        const coinValue = coinValues[currency];
        let amountUsed = 0;
      
        while (change >= coinValue && currencyAmount > 0) {
          change -= coinValue;
          change = Math.round(change * 100) / 100;
          currencyAmount -= coinValue;
          amountUsed += coinValue;
          cid[i][1] -= coinValue;
        }
      
        if (amountUsed > 0) {
          returnedChange.push([currency, amountUsed]);
        }
      }
      return change === 0 ? returnedChange : null;
}

const checkCashRegister = (price, cash, cid) => {
    let change = cash - price;
    let changeAvailable = getTotalCid(cid);

    if (change ===  changeAvailable){
        return changeDueEl.innerHTML = `<p>Status: CLOSED</p>${cid.map((el) =>`<p>${el[0]}: $${el[1]}</p>`).join("")}`;
    }
    else if (change > changeAvailable){
        return changeDueEl.innerHTML = `<p>Status: INSUFFICIENT_FUNDS</p>`;
    }
    else {
        const changeDue = calculateChange(change, cid);
        let changeTextFormatted = changeDue.map((el) => `<p>${el[0]}: $${el[1]}</p>`).join("");
        updateCid();
        return changeDue ? changeDueEl.innerHTML = `<p>Status: OPEN</p>${changeTextFormatted}`: `${JSON.stringify({status: 'INSUFFICIENT_FUNDS', change: []})}`;
    }
}

purchaseBtn.addEventListener("click", () => {
    cash = parseFloat(cashInput.value)
    if (InvalidCashInput(cash)){
        return;
    }
    checkCashRegister(price, cash, cid);
})
cashInput.addEventListener("keypress",(e) => {
    cash = parseFloat(cashInput.value)
    if (e.key === "Enter"){
        e.preventDefault()
        if (InvalidCashInput(cash)){
            return;
        }
        checkCashRegister(price, cash, cid);    
    }
})

