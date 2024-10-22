// procfuncs.js

export function upperCaseKeys(obj) {
  if (Array.isArray(obj)) {
    return obj.map((item) => upperCaseKeys(item));
  } else if (typeof obj === "object" && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key.toUpperCase(),
        upperCaseKeys(value),
      ]),
    );
  }
  return obj;
}

export function camelCaseKeys(obj) {
  if (Array.isArray(obj)) {
    return obj.map((item) => camelCaseKeys(item));
  } else if (typeof obj === "object" && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key.replace(/([-_][a-z])/g, (group) =>
          group.toUpperCase().replace("-", "").replace("_", ""),
        ),
        camelCaseKeys(value),
      ]),
    );
  }
  return obj;
}

export function titleCaseKeys(obj) {
  if (Array.isArray(obj)) {
    return obj.map((item) => titleCaseKeys(item));
  } else if (typeof obj === "object" && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key
          .split(/[-_]/)
          .map(
            (word) =>
              word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
          )
          .join(""),
        titleCaseKeys(value),
      ]),
    );
  }
  return obj;
}

export function insertHyphensBetweenLetters(obj) {
  if (Array.isArray(obj)) {
    return obj.map((item) => insertHyphensBetweenLetters(item));
  } else if (typeof obj === "object" && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key.split("").join("-"),
        insertHyphensBetweenLetters(value),
      ]),
    );
  }
  return obj;
}

// Add more processing functions as needed
