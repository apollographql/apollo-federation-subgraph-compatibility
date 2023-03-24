import path from 'path';

/**
 * Normalizes passed in path to ensure it is always in POSIX format.
 */
export function normalizePath(pathToNormalize: string): string {
  return pathToNormalize.split(path.sep).join(path.posix.sep);
}
