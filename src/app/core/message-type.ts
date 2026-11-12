/** A2UI v1.0 message envelope discriminators, shared by both renderers. */
const MESSAGE_TYPES = [
  'createSurface',
  'updateComponents',
  'updateDataModel',
  'deleteSurface',
  'action',
  'callRendererFunction',
  'callAgentFunction',
] as const;

export type MessageType = (typeof MESSAGE_TYPES)[number] | 'unknown';

export function messageType(message: Record<string, unknown>): MessageType {
  for (const key of MESSAGE_TYPES) {
    if (key in message) return key;
  }
  return 'unknown';
}
