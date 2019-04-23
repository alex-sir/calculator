const nums = document.querySelectorAll(".num");
const operators = document.querySelectorAll(".operator");
let tempEquation = document.querySelector(".display p:first-of-type");
const displayP = document.querySelector(".display p:last-of-type");
const equals = document.querySelector(".equals");
const clearbtn = document.querySelector(".clear");
const deleteChar = document.querySelector(".del");
const decimal = document.querySelector(".decimal");
let number = "";
let numsList = [];
let operatorsList = [];

function add(num1, num2) {
    return num1 + num2;
}

function subtract(num1, num2) {
    return num1 - num2;
}

function multiply(num1, num2) {
    return num1 * num2;
}

function divide(num1, num2) {
    return num1 / num2;
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
            if (tempEquation.textContent === "") {
                displayP.textContent += num.textContent;
                if (scrollingCheck(displayP)) scrollingEnd(displayP);
            } else {
                tempEquation.textContent += num.textContent;
                if (scrollingCheck(tempEquation)) scrollingEnd(tempEquation);
            }
            number += num.textContent;
        });
    });
}

function chooseOperators(operators) {
    operators.forEach(operator => {
        operator.addEventListener("click", function () {
            if (tempEquation.textContent === "") {
                if (/^(\+|\-|\*|\/){1}$/.test(displayP.textContent[displayP.textContent.length - 1])) {
                    return;
                }
                displayP.textContent += operator.textContent;
                if (scrollingCheck(displayP)) scrollingEnd(displayP);
            } else {
                if (/^(\+|\-|\*|\/){1}$/.test(tempEquation.textContent[tempEquation.textContent.length - 1])) {
                    return;
                }
                tempEquation.textContent += operator.textContent;
                if (scrollingCheck(tempEquation)) scrollingEnd(tempEquation);
            }
            numsList.push(+number);
            number = "";
            operatorsList.push(this.textContent);
        });
    });
}

function multiPrecedence(total, operation, numsList, operatorsList) {
    operation = operate(operatorsList[operatorsList.indexOf("*")],
        numsList[operatorsList.indexOf("*")],
        numsList[operatorsList.indexOf("*") + 1]);
    total = operation;
    numsList[operatorsList.indexOf("*")] = total;
    numsList.splice(operatorsList.indexOf("*") + 1, 1);
    operatorsList.splice(operatorsList.indexOf("*"), 1);
    return {
        total: total,
        operation: operation,
        numsList: numsList,
        operatorsList: operatorsList
    }
}

function divPrecedence(total, operation, numsList, operatorsList) {
    operation = operate(operatorsList[operatorsList.indexOf("/")],
        numsList[operatorsList.indexOf("/")],
        numsList[operatorsList.indexOf("/") + 1]);
    total = operation;
    numsList[operatorsList.indexOf("/")] = total;
    numsList.splice(operatorsList.indexOf("/") + 1, 1);
    operatorsList.splice(operatorsList.indexOf("/"), 1);
    return {
        total: total,
        operation: operation,
        numsList: numsList,
        operatorsList: operatorsList
    }
}

function execute(equals) {
    equals.addEventListener("click", function () {
        tempEquation.classList.add("temp-equation");
        if (displayP.textContent === "" ||
            /(\+|\-|\*|\/)/.test(displayP.textContent[displayP.textContent.length - 1])) {
            return;
        }
        numsList.push(+number);
        operatorsList.push(this.textContent);
        if (operatorsList.indexOf("/") === numsList.indexOf(0) - 1 &&
            numsList.indexOf(0) - 1 !== -1) {
            displayP.textContent = "ERR";
            return;
        }
        let operation;
        let total = 0;
        for (let i = 0; i < numsList.length - 1; i++) {
            if (operatorsList.indexOf("*") !== -1 &&
                operatorsList.indexOf("/") !== -1) {
                if (operatorsList.indexOf("*") < operatorsList.indexOf("/")) {
                    if (operatorsList.indexOf("*") != -1) {
                        let multiResult = multiPrecedence(total, operation, numsList, operatorsList);
                        total = multiResult.total;
                        operation = multiResult.operation;
                        numsList = multiResult.numsList;
                        operatorsList = multiResult.operatorsList;
                        i -= 1;
                        continue;
                    }
                } else {
                    if (operatorsList.indexOf("/") != -1) {
                        let divResult = divPrecedence(total, operation, numsList, operatorsList);
                        total = divResult.total;
                        operation = divResult.operation;
                        numsList = divResult.numsList;
                        operatorsList = divResult.operatorsList;
                        i -= 1;
                        continue;
                    }
                }
            }
            if (operatorsList.indexOf("*") != -1) {
                let multiResult = multiPrecedence(total, operation, numsList, operatorsList);
                total = multiResult.total;
                operation = multiResult.operation;
                numsList = multiResult.numsList;
                operatorsList = multiResult.operatorsList;
                i -= 1;
                continue;
            }
            if (operatorsList.indexOf("/") != -1) {
                let divResult = divPrecedence(total, operation, numsList, operatorsList);
                total = divResult.total;
                operation = divResult.operation;
                numsList = divResult.numsList;
                operatorsList = divResult.operatorsList;
                i -= 1;
                continue;
            }
            operation = operate(operatorsList[i], numsList[i], numsList[i + 1]);
            total = operation;
            numsList[i + 1] = total;
        }
        if (scrollingCheck(tempEquation)) scrollingStart(tempEquation);
        total = Math.round(total * 100) / 100;
        tempEquation.textContent = total;
        displayP.textContent = total;
        numsList = [];
        operatorsList = [];
        number = total;
    });
}

function clear(clear) {
    clear.addEventListener("click", () => {
        displayP.textContent = "";
        tempEquation.textContent = "";
        numsList = [];
        operatorsList = [];
        number = "";
    });
}

function del(deleteChar) {
    deleteChar.addEventListener("click", () => {
        if (tempEquation.textContent === "") {
            if (displayP.textContent[displayP.textContent.length - 1] === ".") {
                number = number.toString().slice(0, -1);
            } else if (!isNaN(+displayP.textContent[displayP.textContent.length - 1])) {
                displayP.textContent = displayP.textContent.slice(0, -1);
                number = number.toString().slice(0, -1);
                return;
            } else if (/(\+|\-|\*|\/)/.test(displayP.textContent[displayP.textContent.length - 1])) {
                displayP.textContent = displayP.textContent.slice(0, -1);
                number = +displayP.textContent[displayP.textContent.length - 1];
                operatorsList.pop();
                numsList.pop();
                return;
            }
            displayP.textContent = displayP.textContent.slice(0, -1);
        } else {
            if (tempEquation.textContent.length === 1) {
                return;
            } else if (tempEquation.textContent[tempEquation.textContent.length - 1] === ".") {
                number = number.toString().slice(0, -1);
            } else if (!isNaN(+tempEquation.textContent[tempEquation.textContent.length - 1])) {
                tempEquation.textContent = tempEquation.textContent.slice(0, -1);
                number = number.toString().slice(0, -1);
                return;
            } else if (/(\+|\-|\*|\/)/.test(tempEquation.textContent[tempEquation.textContent.length - 1])) {
                tempEquation.textContent = tempEquation.textContent.slice(0, -1);
                number = +tempEquation.textContent[tempEquation.textContent.length - 1];
                operatorsList.pop();
                numsList.pop();
                return;
            }
            tempEquation.textContent = tempEquation.textContent.slice(0, -1);
        }
    });
}

function decimalNum(decimal) {
    decimal.addEventListener("click", () => {
        if (number.toString() !== "") {
            if (number.toString().includes(".")) {
                return;
            }
        }
        if (tempEquation.textContent === "") {
            displayP.textContent += ".";
            if (scrollingCheck(displayP)) scrollingEnd(displayP);
        } else {
            tempEquation.textContent += ".";
            if (scrollingCheck(tempEquation)) scrollingEnd(tempEquation);
        }
        number += ".";
    });
}

function scrollingEnd(numBox) {
    numBox.scrollLeft = numBox.scrollWidth;
}

function scrollingStart(numBox) {
    numBox.scrollLeft = numBox.scrollWidth - numBox.scrollWidth;
}

function scrollingCheck(numBox) {
    if (numBox.scrollWidth > numBox.clientWidth) {
        return true;
    }
    return false;
}

function main() {
    chooseNums(nums);
    chooseOperators(operators);
    execute(equals);
    clear(clearbtn);
    del(deleteChar);
    decimalNum(decimal);
}

window.onload = main();