const NON_NEGATIVE_DECIMAL_PATTERN = /^\d+(\.\d+)?$/;

export const MAX_DB_INTEGER_DIGITS = 12;
export const MAX_DB_DECIMAL_UPPER_BOUND = 1_000_000_000_000;

function getNormalizedIntegerPart(value: string) {
  const [integerPart] = value.split(".");
  const normalized = integerPart.replace(/^0+(?=\d)/, "");
  return normalized.length > 0 ? normalized : "0";
}

function getFractionPart(value: string) {
  return value.split(".")[1] ?? "";
}

export function isNonNegativeDecimalString(value: string) {
  return NON_NEGATIVE_DECIMAL_PATTERN.test(value);
}

export function hasAllowedIntegerDigits(value: string, maxIntegerDigits = MAX_DB_INTEGER_DIGITS) {
  return getNormalizedIntegerPart(value).length <= maxIntegerDigits;
}

export function hasAllowedFractionDigits(value: string, maxFractionDigits: number) {
  return getFractionPart(value).length <= maxFractionDigits;
}
