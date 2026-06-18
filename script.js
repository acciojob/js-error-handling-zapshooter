//your code here
class OutOfRangeError extends Error {
  constructor(arg) {
    super(`Expression should only consist of integers and +-/* characters and not ${arg}`);
    this.name = "OutOfRangeError";
  }
}

class InvalidExprError extends Error {
  constructor() {
    super("Expression should not have an invalid combination of expression");
    this.name = "InvalidExprError";
  }
}

function evalString(expression) {
  // Check for invalid (out-of-range) characters
  const invalidMatch = expression.match(/[^0-9+\-*\/\s]/);
  if (invalidMatch) {
    throw new OutOfRangeError(invalidMatch[0]);
  }

  // Check for invalid operator combinations: two operators in a row (e.g. ++, */, +*)
  // Allow leading minus for negative numbers, but not things like "5 */ 3" or "5 ++ 3"
  if (/[+\-*/]{2,}/.test(expression.replace(/\s/g, ""))) {
    // Allow a single leading minus sign or minus after an operator (e.g. "5 * -3")
    // But not double operators like ++, **, /*, etc.
    const cleaned = expression.replace(/\s/g, "");
    if (/([+\-*/][+*/])|([+*/]{2,})/.test(cleaned)) {
      throw new InvalidExprError();
    }
  }

  // Check for operator at end of expression
  if (/[+\-*/]\s*$/.test(expression.trim())) {
    throw new InvalidExprError();
  }

  // Check for expression starting with an operator other than minus
  if (/^\s*[+*/]/.test(expression)) {
    throw new InvalidExprError();
  }

  return eval(expression);
}

function evaluate() {
  const input = document.getElementById("expression").value;
  const resultBox = document.getElementById("result");
  const errorBox = document.getElementById("error");

  resultBox.textContent = "";
  errorBox.textContent = "";
  resultBox.classList.remove("visible");
  errorBox.classList.remove("visible");

  if (!input.trim()) {
    errorBox.textContent = "Please enter an expression.";
    errorBox.classList.add("visible");
    return;
  }

  try {
    const result = evalString(input);
    resultBox.textContent = `= ${result}`;
    resultBox.classList.add("visible");
  } catch (e) {
    errorBox.textContent = `${e.name}: ${e.message}`;
    errorBox.classList.add("visible");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("eval-btn");
  const input = document.getElementById("expression");

  btn.addEventListener("click", evaluate);

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") evaluate();
  });
});