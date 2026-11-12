/**
 * Unwraps `.default` when a CommonJS package (such as `react` or `react-dom/client`)
 * is split into a lazy ESM chunk by esbuild and exposes exports only under `default`.
 */
export function resolveModuleExport<T extends object>(mod: T & {default?: T}, key: keyof T): T {
  if (key in mod && mod[key] !== undefined) return mod;
  if (mod.default && key in mod.default) return mod.default;
  return mod;
}

