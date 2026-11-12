import {highlight} from './highlight';

describe('highlight', () => {
  it('escapes HTML so code can never inject markup', () => {
    const out = highlight('{"a": "<script>alert(1)</script>"}', 'json');
    expect(out).not.toContain('<script>');
    expect(out).toContain('&lt;script&gt;');
    expect(out).toContain('&lt;/script&gt;');
  });

  it('escapes plain text without adding markup', () => {
    expect(highlight('a < b & c', 'text')).toBe('a &lt; b &amp; c');
  });

  it('classifies JSON keys, strings, numbers and booleans', () => {
    const out = highlight('{"name": "a2ui", "n": 1, "ok": true, "v": null}', 'json');
    expect(out).toContain('tok-key');
    expect(out).toContain('tok-str');
    expect(out).toContain('tok-num');
    expect(out).toContain('tok-bool');
    expect(out).toContain('tok-null');
  });

  it('escapes shell commands but marks comments', () => {
    const out = highlight('# comment\nbun add <pkg>', 'bash');
    expect(out).toContain('tok-com');
    expect(out).toContain('&lt;pkg&gt;');
  });

  it('handles TypeScript keywords, strings and comments', () => {
    const out = highlight('const x = "a"; // note', 'ts');
    expect(out).toContain('tok-kw');
    expect(out).toContain('tok-str');
    expect(out).toContain('tok-com');
  });
});
