// Theme slider logic
const themeSlider = document.getElementById("theme-slider");
const root = document.documentElement;

function setThemeBySlider(val) {
  root.removeAttribute("color-two");
  root.removeAttribute("color-three");
  if (val == 2 || val == "2") {
    root.setAttribute("color-two", "");
  } else if (val == 3 || val == "3") {
    root.setAttribute("color-three", "");
  }
  // If 1, use default
}

themeSlider.addEventListener("input", (e) => {
  setThemeBySlider(e.target.value);
});

window.addEventListener("DOMContentLoaded", () => {
  let theme = 1;
  if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    theme = 2;
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    theme = 1;
  }
  themeSlider.value = theme;
  setThemeBySlider(theme);
});

//calculator logic

let display = document.getElementById("input-field");

function addToDisplay(value) {
  if (display.value === "NaN") {
    display.value = "";
  }
  display.value += value;
}

window.addToDisplay = addToDisplay;

function clearDisplay() {
  display.value = "";
}
window.clearDisplay = clearDisplay;

function deleteOne() {
  display.value = display.value.slice(0, -1);
}
window.deleteOne = deleteOne;

document.addEventListener("keydown", function (event) {
  const key = event.key;

  if (key >= "0" && key <= "9") {
    addToDisplay(key);
  } else if (key === ".") {
    addToDisplay(".");
  } else if (["+", "-", "*", "/"].includes(key)) {
    addToDisplay(key === "*" ? "×" : key);
  } else if (key === "Enter" || key === "=") {
    solveAll();
  } else if (key === "Escape") {
    clearDisplay();
  } else if (key === "Backspace") {
    deleteOne();
  }
});

// Simple calculator using recursive descent parsing
class SimpleCalculator {
  constructor() {
    this.expression = "";
    this.index = 0;
  }

  calculate(expression) {
    this.expression = expression.replace(/\s/g, "").replace(/x/gi, "*"); // Remove spaces
    this.index = 0;
    return this.parseExpression();
  }

  parseExpression() {
    let result = this.parseTerm();

    while (this.index < this.expression.length) {
      const operator = this.expression[this.index];

      if (operator === "+" || operator === "-") {
        this.index++;
        const term = this.parseTerm();
        result = operator === "+" ? result + term : result - term;
      } else {
        break;
      }
    }

    return result;
  }

  parseTerm() {
    let result = this.parseFactor();

    while (this.index < this.expression.length) {
      const operator = this.expression[this.index];

      if (operator === "*" || operator === "/") {
        this.index++;
        const factor = this.parseFactor();
        if (operator === "*") {
          result = result * factor;
        } else {
          if (factor === 0) throw new Error("Division by zero");
          result /= factor;
        }
      } else {
        break;
      }
    }

    return result;
  }

  parseFactor() {
    if (this.expression[this.index] === "(") {
      this.index++; // Skip '('
      const result = this.parseExpression();
      this.index++; // Skip ')'
      return result;
    }

    return this.parseNumber();
  }

  parseNumber() {
    let numStr = "";
    let hasDecimal = false;

    // Handle negative numbers
    if (this.expression[this.index] === "-") {
      numStr += "-";
      this.index++;
    }

    while (this.index < this.expression.length) {
      const char = this.expression[this.index];

      if (char >= "0" && char <= "9") {
        numStr += char;
        this.index++;
      } else if (char === "." && !hasDecimal) {
        numStr += char;
        hasDecimal = true;
        this.index++;
      } else {
        break;
      }
    }

    return parseFloat(numStr);
  }
}

const calc = new SimpleCalculator();

const solveAll = () => {
  display.value = calc.calculate(display.value);
};

window.solveAll = solveAll;
