import {SCENARIOS, messageType, scenarioById} from './scenarios';

describe('scenarios', () => {
  it('exposes non-empty scenarios with unique ids', () => {
    expect(SCENARIOS.length).toBeGreaterThan(0);
    expect(new Set(SCENARIOS.map(s => s.id)).size).toBe(SCENARIOS.length);
    for (const scenario of SCENARIOS) {
      expect(scenario.messages.length).toBeGreaterThan(0);
    }
  });

  it('falls back to the first scenario for an unknown id', () => {
    expect(scenarioById('does-not-exist')).toBe(SCENARIOS[0]);
  });

  it('starts every scenario with createSurface and a v1.0 envelope', () => {
    for (const scenario of SCENARIOS) {
      expect(scenario.messages[0]['version']).toBe('1.0');
      expect(messageType(scenario.messages[0])).toBe('createSurface');
      for (const message of scenario.messages) {
        expect(message['version']).toBe('1.0');
      }
    }
  });

  it('recognises every v1.0 message type', () => {
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
    expect(messageType({})).toBe('unknown');
  });
});
