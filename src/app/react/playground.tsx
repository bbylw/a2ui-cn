import {useEffect, useMemo, useRef, useState} from 'react';
import {Braces, Check, Copy, Download, ListTree, Pause, Play, RotateCcw, SkipForward} from 'lucide-react';
import {Button} from './ui/button';
import {Badge} from './ui/badge';
import {Tabs, TabsContent, TabsList, TabsTrigger} from './ui/tabs';
import {Switch} from './ui/switch';
import {Slider} from './ui/slider';
import {Separator} from './ui/separator';
import {cn} from './lib/utils';
import {messageType} from '../core/message-type';

export interface PlaygroundScenario {
  id: string;
  name: string;
  description: string;
  messages: Record<string, unknown>[];
}

export interface StreamState {
  scenarioId: string;
  resetToken: number;
  messages: Record<string, unknown>[];
}

export interface PlaygroundProps {
  scenarios: PlaygroundScenario[];
  onStream: (state: StreamState) => void;
  onVisibility: (visibility: {angular: boolean; react: boolean}) => void;
}

const TYPE_VARIANT: Record<string, 'info' | 'default' | 'success' | 'warning' | 'danger' | 'secondary'> = {
  createSurface: 'info',
  updateComponents: 'default',
  updateDataModel: 'success',
  deleteSurface: 'danger',
  action: 'warning',
  callRendererFunction: 'warning',
  callAgentFunction: 'warning',
};

export function Playground({scenarios, onStream, onVisibility}: PlaygroundProps) {
  const [scenarioId, setScenarioId] = useState(scenarios[0]?.id ?? 'flight');
  const [customMessages, setCustomMessages] = useState<Record<string, unknown>[] | null>(null);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(700);
  const [autoLoop, setAutoLoop] = useState(false);
  const [resetToken, setResetToken] = useState(0);
  const [tab, setTab] = useState('stream');
  const [editorText, setEditorText] = useState('');
  const [editorError, setEditorError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showAngular, setShowAngular] = useState(true);
  const [showReact, setShowReact] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);

  const scenario = scenarios.find(s => s.id === scenarioId) ?? scenarios[0];
  // Keep a stable reference: several effects depend on it, and a fresh [] on every
  // render would retrigger them forever.
  const activeMessages = useMemo(() => customMessages ?? scenario?.messages ?? [], [customMessages, scenario]);
  const total = activeMessages.length;
  const effectiveId = customMessages ? 'custom' : scenarioId;

  useEffect(() => {
    setEditorText(JSON.stringify(activeMessages, null, 2));
  }, [activeMessages]);

  useEffect(() => {
    onStream({scenarioId: effectiveId, resetToken, messages: activeMessages.slice(0, step)});
  }, [step, resetToken, effectiveId, activeMessages, onStream]);

  useEffect(() => {
    onVisibility({angular: showAngular, react: showReact});
  }, [showAngular, showReact, onVisibility]);

  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => {
      if (step < total) {
        setStep(s => s + 1);
      } else if (autoLoop) {
        setStep(0);
        setResetToken(t => t + 1);
      } else {
        setPlaying(false);
      }
    }, step >= total ? 1200 : speed);
    return () => clearTimeout(timer);
  }, [playing, step, total, speed, autoLoop]);

  useEffect(() => {
    const list = listRef.current;
    const node = list?.querySelector<HTMLElement>(`[data-step="${step}"]`);
    if (!list || !node) return;
    const listRect = list.getBoundingClientRect();
    const nodeRect = node.getBoundingClientRect();
    if (nodeRect.bottom > listRect.bottom) list.scrollTop += nodeRect.bottom - listRect.bottom + 8;
    else if (nodeRect.top < listRect.top) list.scrollTop -= listRect.top - nodeRect.top + 8;
  }, [step]);

  const restart = (messages?: Record<string, unknown>[]) => {
    if (messages) setCustomMessages(messages);
    setStep(0);
    setResetToken(t => t + 1);
    setPlaying(true);
    setEditorError(null);
  };

  const selectScenario = (id: string) => {
    setScenarioId(id);
    setCustomMessages(null);
    restart();
  };

  const togglePlay = () => {
    if (!playing && step >= total) {
      restart();
      return;
    }
    setPlaying(p => !p);
  };

  const stepOnce = () => {
    setPlaying(false);
    if (step < total) setStep(s => s + 1);
  };

  const jumpTo = (target: number) => {
    setPlaying(false);
    setStep(target);
    setResetToken(t => t + 1);
  };

  const applyEditor = () => {
    try {
      const parsed: unknown = JSON.parse(editorText);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        setEditorError('需要一个非空的 JSON 消息数组。');
        return;
      }
      if (parsed.some(m => typeof m !== 'object' || m === null || Array.isArray(m))) {
        setEditorError('数组中的每一项都必须是消息对象。');
        return;
      }
      restart(parsed as Record<string, unknown>[]);
      setTab('stream');
    } catch (err) {
      setEditorError(`JSON 解析失败:${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const copyJson = async () => {
    try {
      await navigator.clipboard.writeText(editorText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setEditorError('复制失败,请手动选择文本复制。');
    }
  };

  const downloadJson = () => {
    const blob = new Blob([editorText], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `a2ui-${effectiveId}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    // Revoke on the next tick: Chrome may still be reading the blob after click().
    setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  const progress = total === 0 ? 0 : Math.round((step / total) * 100);
  const activeScenarioName = customMessages ? '自定义消息' : scenario?.name;

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const m of activeMessages.slice(0, step)) {
      const t = messageType(m);
      counts[t] = (counts[t] ?? 0) + 1;
    }
    return counts;
  }, [activeMessages, step]);

  return (
    <div className="flex h-full flex-col gap-4 rounded-xl border border-line-cool bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-display text-base font-bold text-ink">消息控制台</h3>
        <Badge variant="info">{activeScenarioName}</Badge>
        <Badge variant={playing ? 'success' : 'secondary'}>
          <span className={cn('inline-block size-1.5 rounded-full', playing ? 'bg-green animate-live' : 'bg-ink-faint')} />
          {playing ? '播放中' : step >= total ? '已完成' : '已暂停'}
        </Badge>
        <span className="ml-auto font-mono text-xs text-ink-mute">
          {step}/{total} 条 — {progress}%
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-mist">
        <div className="h-full rounded-full bg-blue transition-all duration-300" style={{width: `${progress}%`}} />
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="示例场景">
        {scenarios.map(s => (
          <Button
            key={s.id}
            size="sm"
            variant={!customMessages && scenarioId === s.id ? 'primary' : 'outline'}
            onClick={() => selectScenario(s.id)}
          >
            {s.name}
          </Button>
        ))}
        {customMessages && <Badge variant="warning">自定义</Badge>}
      </div>
      <p className="text-xs leading-relaxed text-ink-soft">{customMessages ? '正在播放你编辑的消息流。' : scenario?.description}</p>

      <Separator />

      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="播放控制">
        <Button size="icon" variant="primary" onClick={togglePlay} aria-label={playing ? '暂停' : '播放'} title={playing ? '暂停' : '播放'}>
          {playing ? <Pause /> : <Play />}
        </Button>
        <Button size="icon" variant="outline" onClick={stepOnce} aria-label="单步" title="单步发送下一条消息" disabled={step >= total}>
          <SkipForward />
        </Button>
        <Button size="icon" variant="outline" onClick={() => restart()} aria-label="重置" title="重置并重新播放">
          <RotateCcw />
        </Button>
        <div className="ml-1 flex min-w-40 flex-1 items-center gap-3">
          <span className="whitespace-nowrap font-mono text-[11px] text-ink-mute">间隔 {speed}ms</span>
          <Slider
            min={150}
            max={1500}
            step={50}
            value={[speed]}
            onValueChange={([v]) => setSpeed(v)}
            aria-label="消息间隔"
            className="max-w-44"
          />
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-ink-soft">
          <Switch checked={autoLoop} onCheckedChange={setAutoLoop} aria-label="循环播放" />
          循环
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-4" role="group" aria-label="预览开关">
        <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-ink-soft">
          <Switch checked={showAngular} onCheckedChange={setShowAngular} aria-label="显示 Angular 预览" />
          Angular 预览
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-ink-soft">
          <Switch checked={showReact} onCheckedChange={setShowReact} aria-label="显示 React 预览" />
          React 预览
        </label>
        <div className="ml-auto flex gap-1.5">
          {Object.entries(typeCounts).map(([type, count]) => (
            <Badge key={type} variant={TYPE_VARIANT[type] ?? 'secondary'} className="font-mono text-[10px]">
              {type} ×{count}
            </Badge>
          ))}
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="flex min-h-0 flex-1 flex-col">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="stream" className="flex-1 sm:flex-none">
            <ListTree className="size-3.5" /> 消息流
          </TabsTrigger>
          <TabsTrigger value="editor" className="flex-1 sm:flex-none">
            <Braces className="size-3.5" /> JSON 编辑
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stream" className="min-h-0 flex-1">
          <div ref={listRef} className="dark-scroll grid max-h-105 min-h-48 gap-1.5 overflow-y-auto rounded-lg border border-line-cool bg-mist/60 p-2">
            {activeMessages.map((message, index) => {
              const type = messageType(message);
              const processed = index < step;
              const isNext = index === step;
              return (
                <button
                  key={index}
                  type="button"
                  data-step={index + 1}
                  onClick={() => jumpTo(index + 1)}
                  title={`跳转到第 ${index + 1} 条消息`}
                  className={cn(
                    'grid cursor-pointer grid-cols-[auto_auto_1fr] items-center gap-2 rounded-md border-l-2 px-2.5 py-1.5 text-left transition-all',
                    processed ? 'border-blue bg-white opacity-100' : 'border-transparent opacity-55 hover:opacity-80',
                    isNext && 'border-amber bg-amber-tint/60 opacity-100',
                  )}
                >
                  <span className="font-mono text-[10px] text-ink-mute">{String(index + 1).padStart(2, '0')}</span>
                  <Badge variant={TYPE_VARIANT[type] ?? 'secondary'} className="font-mono text-[10px]">{type}</Badge>
                  <span className="truncate font-mono text-[11px] text-ink-soft">{JSON.stringify(message)}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-[11px] text-ink-mute">点击任意消息可跳转到该步骤;跳转会在两个渲染器中重新放流。</p>
        </TabsContent>

        <TabsContent value="editor" className="min-h-0 flex-1">
          <textarea
            value={editorText}
            onChange={e => setEditorText(e.target.value)}
            spellCheck={false}
            aria-label="A2UI 消息 JSON 编辑器"
            className="dark-scroll h-80 w-full resize-y rounded-lg border border-line-dark bg-ink-950 p-3 font-mono text-xs leading-relaxed text-[#d7e2f4] outline-none focus-visible:ring-2 focus-visible:ring-blue/60"
          />
          {editorError && (
            <div role="alert" className="mt-2 rounded-lg border border-red/30 bg-red-tint px-3 py-2 text-xs text-red-deep">
              {editorError}
            </div>
          )}
          <div className="mt-2 flex flex-wrap gap-2">
            <Button size="sm" variant="primary" onClick={applyEditor}>
              <Play className="size-3.5" /> 应用并播放
            </Button>
            <Button size="sm" variant="outline" onClick={() => selectScenario(scenarioId === 'custom' ? scenarios[0].id : scenarioId)}>
              <RotateCcw className="size-3.5" /> 还原示例
            </Button>
            <Button size="sm" variant="outline" onClick={copyJson}>
              {copied ? <Check className="size-3.5 text-green" /> : <Copy className="size-3.5" />} {copied ? '已复制' : '复制'}
            </Button>
            <Button size="sm" variant="outline" onClick={downloadJson}>
              <Download className="size-3.5" /> 下载
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}