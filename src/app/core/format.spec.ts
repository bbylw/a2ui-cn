import {formatContext} from './format';

describe('formatContext', () => {
  it('returns an empty string for an empty context', () => {
    expect(formatContext({})).toBe('');
  });

  it('renders entries as a compact key/value list', () => {
    expect(formatContext({pax: 2, name: 'Ada'})).toBe('pax: 2, name: "Ada"');
  });

  it('serialises nested values instead of emitting [object Object]', () => {
    expect(formatContext({route: {from: 'BER', to: 'SFO'}})).toBe(
      'route: {"from":"BER","to":"SFO"}',
    );
  });
});
