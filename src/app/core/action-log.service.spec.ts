import {ActionLogService} from './action-log.service';

describe('ActionLogService', () => {
  let service: ActionLogService;

  beforeEach(() => {
    service = new ActionLogService();
  });

  it('adds entries newest-first and fills in defaults', () => {
    service.add({name: 'first'}, 'angular');
    service.add({name: 'second', context: {pax: 2}}, 'react');

    const entries = service.entries();
    expect(entries).toHaveLength(2);
    expect(entries[0].name).toBe('second');
    expect(entries[0].from).toBe('react');
    expect(entries[0].context).toEqual({pax: 2});
    expect(entries[1].from).toBe('angular');
    expect(entries[1].sourceComponentId).toBe('');
    expect(entries[0].timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('clear() empties the log', () => {
    service.add({name: 'one'}, 'react');
    service.clear();
    expect(service.entries()).toEqual([]);
  });

  it('caps the log at 24 entries', () => {
    for (let i = 0; i < 30; i++) {
      service.add({name: `action-${i}`}, 'angular');
    }
    expect(service.entries()).toHaveLength(24);
    expect(service.entries()[0].name).toBe('action-29');
    expect(service.entries()[23].name).toBe('action-6');
  });
});
