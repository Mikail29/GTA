/** Liest einen einzelnen Suchparameter sicher aus (begrenzte Länge). */
export function param(value: string | string[] | undefined, max = 100) {
  const v = Array.isArray(value) ? value[0] : value;
  return v ? v.slice(0, max) : undefined;
}

export type SearchParams = Promise<Record<string, string | string[] | undefined>>;
