import {Injectable, signal} from '@angular/core';

export interface ActionEntry {
  id: number;
  name: string;
  surfaceId: string;
  sourceComponentId: string;
  timestamp: string;
  context: Record<string, unknown>;
  from: 'angular' | 'react';
}

@Injectable({providedIn: 'root'})
export class ActionLogService {
  readonly entries = signal<ActionEntry[]>([]);
  private nextId = 1;

  add(action: Record<string, any>, from: 'angular' | 'react'): void {
    const entry: ActionEntry = {
      id: this.nextId++,
      name: String(action?.['name'] ?? 'unknown'),
      surfaceId: String(action?.['surfaceId'] ?? ''),
      sourceComponentId: String(action?.['sourceComponentId'] ?? ''),
      timestamp: String(action?.['timestamp'] ?? new Date().toISOString()),
      context: (action?.['context'] ?? {}) as Record<string, unknown>,
      from,
    };
    this.entries.update(list => [entry, ...list].slice(0, 24));
  }

  clear(): void {
    this.entries.set([]);
  }
}