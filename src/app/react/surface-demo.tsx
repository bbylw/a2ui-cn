import {useEffect, useRef, useState} from 'react';
import {A2uiSurface, type ReactCatalogComponent} from '@a2ui/react';
import {MessageProcessor, basicCatalog, type SurfaceModel, type Subscription} from '@a2ui/web_core/v1_0';
import {ensureA2uiSetup} from './a2ui-setup';

export interface SurfaceDemoProps {
  messages: Record<string, unknown>[];
  resetKey?: number;
  onAction?: (action: Record<string, unknown>) => void;
}

export function SurfaceDemo({messages, resetKey = 0, onAction}: SurfaceDemoProps) {
  ensureA2uiSetup();
  const [surfaces, setSurfaces] = useState<SurfaceModel<ReactCatalogComponent>[]>([]);
  const [error, setError] = useState<string | null>(null);
  const processorRef = useRef<MessageProcessor<ReactCatalogComponent> | null>(null);
  const subsRef = useRef<Subscription[]>([]);
  const processedRef = useRef(0);
  const lastResetRef = useRef<number | null>(null);
  const onActionRef = useRef(onAction);
  onActionRef.current = onAction;

  useEffect(() => {
    let processor = processorRef.current;
    if (!processor || lastResetRef.current !== resetKey) {
      subsRef.current.forEach(s => s.unsubscribe());
      processor?.dispose();
      processor = new MessageProcessor<ReactCatalogComponent>([basicCatalog], action =>
        onActionRef.current?.(action as unknown as Record<string, unknown>),
      );
      processorRef.current = processor;
      subsRef.current = [
        processor.onSurfaceCreated(() => setSurfaces(Array.from(processor!.getSurfaces().values()))),
        processor.onSurfaceDeleted(() => setSurfaces(Array.from(processor!.getSurfaces().values()))),
      ];
      processedRef.current = 0;
      lastResetRef.current = resetKey;
      setError(null);
    }
    if (messages.length > processedRef.current) {
      try {
        processor.processMessages(messages.slice(processedRef.current) as never);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
      processedRef.current = messages.length;
      setSurfaces(Array.from(processor.getSurfaces().values()));
    }
  }, [messages, resetKey]);

  useEffect(
    () => () => {
      subsRef.current.forEach(s => s.unsubscribe());
      processorRef.current?.dispose();
      processorRef.current = null;
    },
    [],
  );

  return (
    <div className="grid gap-3">
      {error && (
        <div role="alert" className="rounded-lg border border-red/30 bg-red-tint px-3 py-2 font-mono text-xs text-red">
          渲染错误:{error}
        </div>
      )}
      {surfaces.length === 0 && !error && (
        <p className="py-6 text-center text-sm text-ink-faint">等待消息流…</p>
      )}
      {surfaces.map(surface => (
        <A2uiSurface key={surface.id} surface={surface} />
      ))}
    </div>
  );
}