let currentInput = '';
let operator = '';
let previousInput = '';

const resultDisplay = document.getElementById('result');

function appendInput(value) {
  if (value === '.' && currentInput.includes('.')) {
    return; // Prevent multiple decimal points
  }
  currentInput += value;
  updateDisplay();
}

function clearDisplay() {
  currentInput = '';
  operator = '';
  previousInput = '';
  updateDisplay();
}

function deleteLast() {
  currentInput = currentInput.slice(0, -1);
  updateDisplay();
}

function updateDisplay() {
  resultDisplay.value = currentInput || '0'; // Show 0 if input is empty
}

function calculateResult() {
  if (currentInput === '' || previousInput === '') {
    // If there's no second operand or no first operand, do nothing or handle error
    // For now, if currentInput is present but no previousInput, treat currentInput as the result
    if (currentInput !== '' && previousInput === '' && operator === '') {
        previousInput = currentInput; // Allows pressing '=' on a single number
        // currentInput = ''; // Optional: clear currentInput
        updateDisplay(); // Display the number itself
        return;
    } else if (currentInput === '' && previousInput !== '' && operator !== ''){
        // If there was '5 * =' then currentInput is empty, so use previousInput as second operand
        currentInput = previousInput;
    }
     else {
        return; // Not enough info to calculate
    }
  }

  let result;
  const prev = parseFloat(previousInput);
  const current = parseFloat(currentInput);

  if (isNaN(prev) || isNaN(current)) {
    resultDisplay.value = 'Error';
    currentInput = ''; // Reset currentInput after error
    previousInput = '';
    operator = '';
    return;
  }

  switch (operator) {
    case '+':
      result = prev + current;
      break;
    case '-':
      result = prev - current;
      break;
    case '*':
      result = prev * current;
      break;
    case '/':
      if (current === 0) {
        resultDisplay.value = 'Error'; // Division by zero
        currentInput = '';
        previousInput = '';
        operator = '';
        return;
      }
      result = prev / current;
      break;
    default:
      // This case might be hit if only a number is entered and '=' is pressed.
      // Or if an operation is pending but not enough numbers.
      // If an operator was set, but we somehow got here, it's an issue.
      // If no operator, and both previousInput and currentInput are set,
      // this implies a state error or an operation was expected.
      // For now, if an operator is missing and we have two numbers,
      // it's an undefined state, so perhaps just display current or error.
      // However, the initial check for currentInput/previousInput should prevent this.
      resultDisplay.value = currentInput; // Or 'Error'
      // No change to currentInput, previousInput, operator
      return;
  }

  currentInput = result.toString();
  operator = ''; // Reset operator after calculation
  previousInput = ''; // Reset previousInput, calculation is done.
  updateDisplay();
}

// Modify appendInput to handle operators
function appendInput(value) {
  if (['+', '-', '*', '/'].includes(value)) {
    // If an operator is pressed and there's already a previousInput and an operator, calculate first
    if (previousInput !== '' && operator !== '' && currentInput !== '') {
      calculateResult();
      // After calculation, the result is in currentInput.
      // We want this result to be the new previousInput for the next operation.
      previousInput = currentInput;
      operator = value;
      currentInput = ''; // Clear currentInput for the next number
    } else if (currentInput !== '') {
      // If it's the first operator or after an equals, set operator and move current to previous
      operator = value;
      previousInput = currentInput;
      currentInput = '';
    } else if (previousInput !== '' && operator !== '' && currentInput === ''){
        // Handles changing operator e.g. 5 * then user presses -
        operator = value;
    }
    // Do not update display here, wait for next number input
  } else {
    if (value === '.' && currentInput.includes('.')) {
      return; // Prevent multiple decimal points
    }
    currentInput += value;
    updateDisplay();
  }
}

// Initialize display
updateDisplay();
