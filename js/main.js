const nums = document.querySelectorAll(".num");
const operators = document.querySelectorAll(".operator");
const displayP = document.querySelector(".display p");
const equals = document.querySelector(".equals");
const clearbtn = document.querySelector(".clear");
let number = "";
let numsList = [];
let operatorsList = [];

function add(num1, num2) {
    return num1 + num2
}

function subtract(num1, num2) {
    return num1 - num2
}

function multiply(num1, num2) {
    return num1 * num2
}

function divide(num1, num2) {
    return num1 / num2
}

function operate(operator, num1, num2) {
    if (operator === "+") return add(num1, num2);
    else if (operator === "-") return subtract(num1, num2);
    else if (operator === "*") return multiply(num1, num2);
    else if (operator === "/") return divide(num1, num2);
}

function chooseNums(nums) {
    nums.forEach(num => {
        num.addEventListener("click", () => {
            displayP.textContent += num.textContent;
            number += num.textContent;
        });
    });
}

function chooseOperators(operators) {
    operators.forEach(operator => {
        operator.addEventListener("click", function () {
            displayP.textContent += operator.textContent;
            numsList.push(+number);
            number = "";
            operatorsList.push(this.textContent);
            console.log(numsList);
            console.log(operatorsList);
        });
    });
}

function execute(equals) {
    equals.addEventListener("click", function () {
        numsList.push(+number);
        operatorsList.push(this.textContent);
        let operation;
        let total = 0;

        for (let i = 0; i < numsList.length - 1; i++) {
            operation = operate(operatorsList[i], numsList[i], numsList[i + 1]);
            total = operation;
            numsList[i+1] = total;
        }
        displayP.textContent = total;
        console.log(numsList);
        console.log(operatorsList);
        console.log(total);
        numsList = [];
        operatorsList = [];
        number = total;
    });
}

function clear(clear) {
    clear.addEventListener("click", () => {
        displayP.textContent = "";
        numsList = [];
        operatorsList = [];
        number = "";
        console.log("***CLEARED***");
    });
}

function main() {
    chooseNums(nums);
    chooseOperators(operators);
    execute(equals);
    clear(clearbtn);
}

window.onload = main();