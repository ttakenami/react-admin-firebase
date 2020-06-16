interface ParsedUpload {
  fieldDotsPath: string;
  fieldSlashesPath: string;
  rawFile: File | any;
}

interface ParsedDocRef {
  fieldDotsPath: string;
  refPath: string;
}

interface ParseResult {
  uploads: ParsedUpload[]
  refdocs: ParsedDocRef[]
}

export function parseDocGetAllUploads(obj: {}): ParseResult {
  const isObject = !!obj && typeof obj === "object";
  const result: ParseResult = {
    uploads: [],
    refdocs: []
  }
  if (!isObject) {
    return result;
  }
  Object.keys(obj).map((key) => {
    const value = obj[key];
    recusivelyParseObjectValue(value, key, result);
  });
  return result;
}

export function recusivelyParseObjectValue(
  input: any,
  fieldPath: string,
  result: ParseResult
): any {
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
    return (input as []).map((value, index) =>
      recusivelyParseObjectValue(value, `${fieldPath}.${index}`, result)
    );
  }
  const isObject = typeof input === "object";
  if (!isObject) {
    return;
  }
  const isRefField = !!input && input.hasOwnProperty("___refdocument");
  if (isRefField) {
    const refDoc = input as ParsedRefDoc
    result.refdocs.push({
      fieldDotsPath: fieldPath,
      refPath: refDoc.___refdocument
    });
    return;
  }
  const isFileField = !!input && input.hasOwnProperty("rawFile");
  if (isFileField) {
    result.uploads.push({
      fieldDotsPath: fieldPath,
      fieldSlashesPath: fieldPath.split('.').join('/'),
      rawFile: input.rawFile,
    });
    delete input.rawFile;
    return;
  }
  Object.keys(input).map((key) => {
    const value = input[key];
    recusivelyParseObjectValue(value, `${fieldPath}.${key}`, result);
  });
  return input;
}

interface ParsedRefDoc {
  ___refdocument: string
}