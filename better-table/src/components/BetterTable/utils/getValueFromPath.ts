/**
 * Accede a propiedades anidadas de un objeto usando dot notation
 * @param obj - Objeto del cual extraer el valor
 * @param path - Ruta al valor (e.g., 'user.profile.name')
 * @returns El valor encontrado o undefined
 */
export function getValueFromPath<T = unknown>(
  obj: Record<string, unknown>,
  path: string
): T | undefined {
  if (!obj || !path) return undefined;

  const keys = path.split('.');
  let result: unknown = obj;

  for (const key of keys) {
    if (result === null || result === undefined) {
      return undefined;
    }
    if (typeof result === 'object') {
      result = (result as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }

  return result as T;
}
