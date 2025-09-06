document.addEventListener('DOMContentLoaded', () => {
    const resultElement = document.getElementById('result');
    const historyElement = document.getElementById('history');
    const buttons = document.querySelector('.buttons');

    let currentInput = '0';
    let firstOperand = null;
    let operator = null;
    let waitingForSecondOperand = false;
    let history = '';

    function updateDisplay() {
        resultElement.value = currentInput;
        historyElement.textContent = history;
    }

    function handleNumber(number) {
        if (waitingForSecondOperand) {
            currentInput = number;
            waitingForSecondOperand = false;
        } else {
            currentInput = currentInput === '0' ? number : currentInput + number;
        }
    }

    function handleDecimal() {
        if (!currentInput.includes('.')) {
            currentInput += '.';
        }
    }

    function handleOperator(nextOperator) {
        const inputValue = parseFloat(currentInput);

        if (operator && waitingForSecondOperand) {
            operator = nextOperator;
            history = `${firstOperand} ${operator}`;
            updateDisplay();
            return;
        }

        if (firstOperand === null) {
            firstOperand = inputValue;
        } else if (operator) {
            const result = performCalculation[operator](firstOperand, inputValue);
            if (isNaN(result) || !isFinite(result)) {
                currentInput = 'Error';
                history = '';
                firstOperand = null;
                operator = null;
                waitingForSecondOperand = false;
                updateDisplay();
                return;
            }
            currentInput = String(result);
            firstOperand = result;
        }

        waitingForSecondOperand = true;
        operator = nextOperator;
        history = `${firstOperand} ${operator}`;
        updateDisplay();
    }

    const performCalculation = {
        '/': (first, second) => first / second,
        '*': (first, second) => first * second,
        '+': (first, second) => first + second,
        '-': (first, second) => first - second,
    };

    function handleEqual() {
        const inputValue = parseFloat(currentInput);

        if (operator && firstOperand !== null) {
            history = `${firstOperand} ${operator} ${inputValue} =`;
            const result = performCalculation[operator](firstOperand, inputValue);
            if (isNaN(result) || !isFinite(result)) {
                currentInput = 'Error';
                history = '';
                firstOperand = null;
                operator = null;
                waitingForSecondOperand = false;
                updateDisplay();
                return;
            }
            currentInput = String(result);
            firstOperand = null;
            operator = null;
            waitingForSecondOperand = false;
            updateDisplay();
        }
    }

    function handleClear() {
        currentInput = '0';
        firstOperand = null;
        operator = null;
        waitingForSecondOperand = false;
        history = '';
        updateDisplay();
    }

    buttons.addEventListener('click', (event) => {
        const { target } = event;
        const buttonText = target.textContent;
        
        if (target.classList.contains('number')) {
            handleNumber(buttonText);
        } else if (target.classList.contains('operator')) {
            handleOperator(buttonText);
        } else if (target.classList.contains('equal')) {
            handleEqual();
        } else if (target.classList.contains('decimal')) {
            handleDecimal();
        } else if (target.classList.contains('clear')) {
            handleClear();
        }
        updateDisplay();
    });

    updateDisplay();
});
