export function parseAllDocFromFirestore(obj: {}) {
  const isObject = !!obj && typeof obj === "object";
  if (!isObject) {
    return;
  }
  Object.keys(obj).map((key) => {
    const value = obj[key];
    obj[key] = recusivelyCheckObjectValue(value);
  });
}

export function recusivelyCheckObjectValue(input: any) {
  const isFalsey = !input;
  if (isFalsey) {
    return input;
  }
  const isPrimitive = typeof input !== "object";
  if (isPrimitive) {
    return input;
  }
  const isTimestamp = !!input.toDate && typeof input.toDate === "function";
  if (isTimestamp) {
    return input.toDate();
  }
  const isArray = Array.isArray(input);
  if (isArray) {
    return input.map((value) => recusivelyCheckObjectValue(value));
  }
  const isDocumentReference =
    typeof input.id === "string" &&
    typeof input.parent === "object" &&
    typeof input.path === "string";
  if (isDocumentReference) {
    const parsed = { ___refdocument: input.path }
    return parsed;
  }
  const isObject = typeof input === "object";
  if (isObject) {
    Object.keys(input).map((key) => {
      const value = input[key];
      input[key] = recusivelyCheckObjectValue(value);
    });
    return input;
  }
}
