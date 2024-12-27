class Calculator {
    constructor(resultElement) {
        this.resultElement = resultElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        this.currentOperand = this.currentOperand.toString() + number.toString();
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.updateDisplay();
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                if (current === 0) {
                    this.resultElement.value = 'Error: Division by zero';
                    return;
                }
                computation = prev / current;
                break;
            case '^':
                computation = Math.pow(prev, current);
                break;
            default:
                return;
        }
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
    }

    sqrt() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        if (current < 0) {
            this.resultElement.value = 'Error: Invalid input for square root';
            return;
        }
        this.currentOperand = Math.sqrt(current).toString();
        this.updateDisplay();
    }

    percent() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        this.currentOperand = (current / 100).toString();
        this.updateDisplay();
    }

    updateDisplay() {
        if (this.operation != null) {
            this.resultElement.value = `${this.previousOperand} ${this.operation} ${this.currentOperand}`;
        } else {
            this.resultElement.value = this.currentOperand;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const resultElement = document.getElementById('result');
    const calculator = new Calculator(resultElement);

    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            if (button.hasAttribute('data-num')) {
                calculator.appendNumber(button.getAttribute('data-num'));
            } else if (button.hasAttribute('data-action')) {
                const action = button.getAttribute('data-action');
                switch (action) {
                    case 'clear':
                        calculator.clear();
                        break;
                    case 'equals':
                        calculator.compute();
                        calculator.updateDisplay();
                        break;
                    case 'sqrt':
                        calculator.sqrt();
                        break;
                    case 'percent':
                        calculator.percent();
                        break;
                    default:
                        calculator.chooseOperation(action);
                        break;
                }
            }
        });
    });

    // Enable keyboard input
    document.addEventListener('keydown', (event) => {
        const key = event.key;
        if (/[0-9.]/.test(key)) {
            calculator.appendNumber(key);
        } else if (['+', '-', '*', '/'].includes(key)) {
            calculator.chooseOperation(key);
        } else if (key === 'Enter' || key === '=') {
            calculator.compute();
            calculator.updateDisplay();
        } else if (key === 'Escape') {
            calculator.clear();
        }
    });
});
