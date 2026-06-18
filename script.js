class OutOfRangeError extends Error {
  constructor(arg) {
    super(`Expression should only consist of integers and +-/* characters and not '${arg}'`);
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
  // 1. Check for out-of-range characters (anything not digit, operator, space)
  const invalidMatch = expression.match(/[^0-9+\-*\/\s]/);
  if (invalidMatch) {
    throw new OutOfRangeError(invalidMatch[0]);
  }

  const trimmed = expression.trim();

  // 2. Check for leading invalid operator (+ * / but NOT -)
  if (/^[+*/]/.test(trimmed)) {
    const err = new SyntaxError("Expression should not start with invalid operator");
    err.name = "SyntaxError";
    throw err;
  }

  // 3. Check for trailing operator (any of + - * /)
  if (/[+\-*/]$/.test(trimmed)) {
    const err = new SyntaxError("Expression should not end with invalid operator");
    err.name = "SyntaxError";
    throw err;
  }

  // 4. Check for invalid operator combinations (e.g. +/, ++, */, +*, but allow *- or /- for negatives)
  //    Pattern: any operator followed by another operator that is NOT a minus
  if (/[+\-*/][+*/]/.test(expression.replace(/\s/g, ""))) {
    throw new InvalidExprError();
  }

  return eval(expression);
}

function evaluate() {
  const input = document.getElementById("input1").value;
  const resultBox = document.getElementById("result");
  const errorBox = document.getElementById("error");

  resultBox.textContent = "";
  errorBox.textContent = "";
  resultBox.classList.remove("visible");
  errorBox.classList.remove("visible");

  if (!input.trim()) {
    alert("failed");
    return;
  }

  try {
    const result = evalString(input);
    resultBox.textContent = `= ${result}`;
    resultBox.classList.add("visible");
    alert("passed");
  } catch (e) {
    errorBox.textContent = `${e.name}: ${e.message}`;
    errorBox.classList.add("visible");
    alert("failed");
    throw e;  // rethrow so Cypress uncaught:exception handler can inspect it
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector("button");
  const input = document.getElementById("input1");

  btn.addEventListener("click", evaluate);

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") evaluate();
  });
});