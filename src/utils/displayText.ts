export function toDisplayText(value: unknown, fallback = ''): string {
  if (value === null || value === undefined) {
    return fallback;
  }

  if (typeof value === 'string') {
    return value;
  }

  if (
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'bigint'
  ) {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value
      .map(item => toDisplayText(item))
      .filter(Boolean)
      .join(', ');
  }

  if (typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const primaryValue =
      record.value ??
      record.text ??
      record.label ??
      record.title ??
      record.description ??
      record.summary;

    if (primaryValue !== undefined) {
      return toDisplayText(primaryValue, fallback);
    }

    return Object.entries(record)
      .map(([key, entryValue]) => `${key}: ${toDisplayText(entryValue)}`)
      .join(', ');
  }

  return fallback;
}

export function toDisplayTextArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(item => toDisplayText(item)).filter(Boolean);
  }

  const text = toDisplayText(value);
  return text ? [text] : [];
}
