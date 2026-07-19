// helpers.js
// This file holds small reusable functions.

// Takes a value that might be a good number, a bad string like "NaN",
// or missing entirely — and turns it into either a real number or null.
function cleanNumber(value) {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'number') {
    return value;
  }

  // If it's a string like "4.8" or "NaN"
  if (typeof value === 'string') {
    if (value.trim().toUpperCase() === 'NAN') {
      return null;
    }
    const parsed = parseFloat(value);
    if (isNaN(parsed)) {
      return null;
    }
    return parsed;
  }

  return null;
}

// Understands filter text like ">=4.5", "<=400", "=100", or just "60"
// and returns { operator: ">=", value: 4.5 }
function parseFilter(text) {
  if (!text) return null;

  const str = String(text).trim();
  const match = str.match(/^(>=|<=|>|<|=)?\s*(-?\d+(\.\d+)?)$/);

  if (!match) return null;

  const operator = match[1] || '=';
  const value = parseFloat(match[2]);

  return { operator, value };
}

// This lets other files use these functions
module.exports = { cleanNumber, parseFilter };