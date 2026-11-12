import {messageType} from './message-type';

describe('messageType', () => {
  it('recognises every v1.0 envelope key, including renderer/agent function calls', () => {
    const types = [
      'createSurface',
      'updateComponents',
      'updateDataModel',
      'deleteSurface',
      'action',
      'callRendererFunction',
      'callAgentFunction',
    ];
    for (const type of types) {
      expect(messageType({[type]: {}})).toBe(type);
    }
  });

  it('returns unknown for empty or unrelated objects', () => {
    expect(messageType({})).toBe('unknown');
    expect(messageType({version: '1.0'})).toBe('unknown');
  });

  it('uses the first matching key in envelope order', () => {
    expect(messageType({createSurface: {}, updateComponents: {}})).toBe('createSurface');
  });
});
