import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-docs-spec-v091-evolution',
  imports: [RouterLink],
  template: `
    <header class="mb-10">
      <p class="font-mono text-xs text-ink-mute">规范 v0.9.1 / 演进指南</p>
      <h1 class="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">演进指南(v0.9 → v0.9.1)</h1>
      <p class="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
        v0.9.1 是 v0.9 的小幅修订:只有两项变更,载荷完全兼容。本页列出变更细节与迁移动作。原文见
        <a href="https://a2ui.org/specification/v0.9.1-evolution-guide/" target="_blank" rel="noopener">官方 v0.9.1 Evolution Guide</a>。
      </p>
    </header>

    <div class="doc-prose">
      <h2 id="changes">两项变更</h2>
      <table>
        <thead><tr><th>变更</th><th>v0.9</th><th>v0.9.1</th></tr></thead>
        <tbody>
          <tr>
            <td><strong>MIME 类型标准化</strong></td>
            <td>早期草案使用 <code>application/json+a2ui</code></td>
            <td>所有规范指南与扩展元数据示例统一为 <code>application/a2ui+json</code></td>
          </tr>
          <tr>
            <td><strong>surfaceId 唯一性放宽</strong></td>
            <td>surfaceId 必须在渲染器整个生命周期内全局唯一</td>
            <td>只需在<strong>当前活跃</strong> surface 中唯一;不先删除就对已存在的 surfaceId 发 createSurface 仍是错误</td>
          </tr>
        </tbody>
      </table>

      <h2 id="detail">细节</h2>
      <ul>
        <li><strong>MIME:</strong>v0.9 扩展规范的早期草案版本使用旧值 <code>application/json+a2ui</code>;
        v0.9.1 把全部规范文档与扩展元数据示例更新为 <code>application/a2ui+json</code>。</li>
        <li><strong>surfaceId:</strong><code>a2ui_protocol.md</code> 中的 surfaceId 定义删除了
        「必须在渲染器生命周期内全局唯一」的要求,唯一性范围收窄到活跃 surface;
        重复创建(未先 deleteSurface)依旧报错。</li>
      </ul>

      <h2 id="migrate">迁移</h2>
      <blockquote>
        <p>v0.9.1 与 v0.9 载荷<strong>完全兼容</strong>:schema 的版本字段同时接受 <code>"v0.9"</code> 与
        <code>"v0.9.1"</code>,客户端与服务器可以无破坏升级。</p>
      </blockquote>
      <ol>
        <li>把代码里硬编码的 <code>application/json+a2ui</code> 全部替换为 <code>application/a2ui+json</code>——这是唯一必须做的动作。</li>
        <li>版本字符串按需更新为 <code>"v0.9.1"</code>(继续发 <code>"v0.9"</code> 也合法)。</li>
        <li>若实现依赖「生命周期内全局唯一」管理 surfaceId,可放宽为活跃集唯一;保留原逻辑也不违反新规范。</li>
      </ol>

      <h2 id="versions">其他版本跨度</h2>
      <ul>
        <li><strong>v0.8 → v0.9:</strong>见仓库中的 v0.9 Evolution Guide
        (<a href="https://github.com/a2ui-project/a2ui/blob/main/specification/v0_9/docs/evolution_guide.md" target="_blank" rel="noopener"><code>specification/v0_9/docs/evolution_guide.md</code></a>)。</li>
        <li><strong>v0.9.1 → v1.0:</strong>术语、绑定语法、函数调用与目录都有破坏性变化,按
        <a routerLink="/docs/spec-v1-evolution">v1.0 演进指南</a>分角色迁移。</li>
      </ul>
      <p>协议版本状态总览(v1.0 Current / v0.9.1 与 v0.9 Previous / v0.8 Deprecated)见<a routerLink="/docs/roadmap">路线图</a>。</p>
    </div>
  `,
})
export class SpecV091EvolutionPage {}