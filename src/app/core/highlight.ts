function esc(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function span(cls: string, text: string): string {
  return `<span class="${cls}">${esc(text)}</span>`;
}

function highlightJson(code: string): string {
  const re = /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false)\b|\bnull\b|-?\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b|[{}\[\],:]/g;
  let out = '';
  let last = 0;
  for (const m of code.matchAll(re)) {
    out += esc(code.slice(last, m.index));
    const [full, str, colon, bool] = m;
    if (str !== undefined) {
      out += colon ? span('tok-key', str) + esc(colon) : span('tok-str', str);
    } else if (bool !== undefined) {
      out += span('tok-bool', full);
    } else if (full === 'null') {
      out += span('tok-null', full);
    } else if (/^[{}\[\],:]$/.test(full)) {
      out += span('tok-punct', full);
    } else {
      out += span('tok-num', full);
    }
    last = m.index + full.length;
  }
  return out + esc(code.slice(last));
}

function highlightShell(code: string): string {
  return code
    .split('\n')
    .map(line => {
      const trimmed = line.trimStart();
      if (trimmed.startsWith('#')) return span('tok-com', line);
      const re = /("(?:\\.|[^"\\])*"|'[^']*')|(\s--?[\w-]+)|(\b(?:npm|npx|bun|pip|flutter|dart|git|cd|yarn|ng|python|uv|curl|export)\b)/g;
      let out = '';
      let last = 0;
      for (const m of line.matchAll(re)) {
        out += esc(line.slice(last, m.index));
        if (m[1]) out += span('tok-str', m[1]);
        else if (m[2]) out += span('tok-key', m[2]);
        else out += span('tok-fn', m[3]);
        last = m.index + m[0].length;
      }
      return out + esc(line.slice(last));
    })
    .join('\n');
}

const TS_KEYWORDS =
  /\b(?:import|from|export|const|let|var|new|class|extends|implements|return|function|async|await|if|else|for|of|in|readonly|interface|type|satisfies|as|void|this|true|false|null|undefined|default|override|protected|private|public|static|get|set|yield|throw|try|catch|switch|case|break|continue|typeof|keyof|declare)\b/;

function highlightTs(code: string): string {
  const re = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(@[\w.]+)|\b(\d+(?:\.\d+)?)\b|([A-Za-z_$][\w$]*)(?=\s*\()|([A-Za-z_$][\w$]*)/g;
  let out = '';
  let last = 0;
  for (const m of code.matchAll(re)) {
    out += esc(code.slice(last, m.index));
    const [full, comment, str, decorator, num, fn, ident] = m;
    if (comment) out += span('tok-com', full);
    else if (str) out += span('tok-str', full);
    else if (decorator) out += span('tok-tag', full);
    else if (num) out += span('tok-num', full);
    else if (fn) out += TS_KEYWORDS.test(fn) ? span('tok-kw', full) : span('tok-fn', full);
    else if (ident) out += TS_KEYWORDS.test(ident) ? span('tok-kw', full) : esc(full);
    last = m.index + full.length;
  }
  return out + esc(code.slice(last));
}

function highlightDart(code: string): string {
  return highlightTs(code);
}

export function highlight(code: string, lang: string): string {
  switch (lang) {
    case 'json':
    case 'jsonc':
      return highlightJson(code);
    case 'bash':
    case 'sh':
    case 'shell':
    case 'text':
      return lang === 'text' ? esc(code) : highlightShell(code);
    case 'dart':
      return highlightDart(code);
    case 'swift':
    case 'kotlin':
      return highlightTs(code);
    default:
      return highlightTs(code);
  }
}