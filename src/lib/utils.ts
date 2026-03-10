type ClassValue =
  | string
  | number
  | null
  | false
  | undefined
  | ClassValue[]
  | Record<string, boolean | null | undefined>;

const flattenClassValue = (value: ClassValue, result: string[]) => {
  if (!value) return;

  if (typeof value === 'string' || typeof value === 'number') {
    result.push(String(value));
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => flattenClassValue(item, result));
    return;
  }

  Object.entries(value).forEach(([key, included]) => {
    if (included) result.push(key);
  });
};

export function cn(...inputs: ClassValue[]) {
  const classes: string[] = [];
  inputs.forEach((input) => flattenClassValue(input, classes));
  return classes.join(' ');
}
