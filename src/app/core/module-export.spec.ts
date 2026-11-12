import {resolveModuleExport} from './module-export';

describe('resolveModuleExport', () => {
  it('returns the module namespace directly when the export is top-level', () => {
    const createRoot = () => null;
    const mod = {createRoot};

    expect(resolveModuleExport(mod, 'createRoot').createRoot).toBe(createRoot);
  });

  it('unwraps `.default` when an esbuild dynamic CJS chunk only exports default', () => {
    const createRoot = () => null;
    const mod = {default: {createRoot}} as unknown as {
      createRoot: typeof createRoot;
      default: {createRoot: typeof createRoot};
    };

    expect(resolveModuleExport(mod, 'createRoot').createRoot).toBe(createRoot);
  });
});

