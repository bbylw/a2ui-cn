import {Component} from '@angular/core';
import {DocsPageHeader} from '../../shared/docs-page-header';
import {RouterLink} from '@angular/router';
import {CodeBlock} from '../../shared/code-block';

@Component({
  selector: 'app-docs-inference',
  imports: [DocsPageHeader, RouterLink, CodeBlock],
  template: `
    <app-docs-page-header eyebrow="概念" heading="推理格式">
        模型写的标记不等于线上跑的消息。推理格式是模型在 &lt;a2ui&gt; 标签里使用的紧凑写法，
        Agent SDK 把它编译成标准协议 JSON。默认格式 Express 比直接写 JSON 省约一半输入 token、六成代码 token，准确率不变。
    </app-docs-page-header>

    <div class="doc-prose">
      <h2 id="stages">三个阶段</h2>
      <ul>
        <li><strong>提示词合成。</strong>PromptGenerator 读取协商好的目录 schema、instructions 与示例，
          按所选格式生成系统提示片段。</li>
        <li><strong>模型生成。</strong>模型把 UI 写在哨兵标签里，与散文混合输出：
          Express 用 <code>&lt;a2ui&gt;...&lt;/a2ui&gt;</code>，Direct JSON 用
          <code>&lt;a2ui-json&gt;...&lt;/a2ui-json&gt;</code>。</li>
        <li><strong>编译与校验。</strong>Parser/ResponseStream 修补流式分块、把标签块编译成线上 JSON，
          再对照 RendererState 做有状态校验，失败信息可喂回模型自我纠正。</li>
      </ul>

      <h2 id="express">Express：默认的紧凑 DSL</h2>
      <p>Express 用位置参数调用组件构造器、用 <code>$/path = value</code> 写数据、内联嵌套子组件，
      不需要手写组件 id 与重复的键名：</p>
      <app-code lang="text" label="Express 块（官方示例）" [code]="expressSnippet" />
      <p>编译器把它展平成带确定性 id 的标准消息：id 按树位置生成，
      <code>root</code>、<code>root_child</code>、<code>root_child_children_0</code>……
      同一段 Express 每次编译结果相同，便于缓存与回放。v1.0 里初始数据赋值折叠进
      <code>createSurface.dataModel</code>，一条消息完成初始化：</p>
      <app-code lang="json" label="编译结果（v1.0，节选）" [code]="compiledJson" />
      <p>v0.9.1 的编译器则拆成 createSurface、updateComponents、updateDataModel 三条消息。</p>

      <h2 id="direct">Direct JSON</h2>
      <p>模型直接输出协议 JSON 数组，放在 <code>&lt;a2ui-json&gt;</code> 标签里。
      解析器带流式修复（stream healing），未闭合的 JSON 也能先渲染已到达的部分。
      它比 Express 费 token，但对不支持 DSL 的模型或调试场景更直观。</p>

      <h2 id="pluggable">格式是可插拔的</h2>
      <p>推理格式通过工厂注入，可以在生成器级设默认、在处理器级按会话覆盖。
      不同格式编译出的线上消息完全相同，客户端无需任何改动：</p>
      <app-code lang="ts" label="TypeScript：默认 Express，按会话切换 Direct JSON" [code]="factoryTs" />
      <app-code lang="python" label="Python：同样的两级配置" [code]="factoryPy" />
      <p>Python SDK 另有实验性的 Atom、Elemental 格式。自定义格式实现
      compile/decompile 双向转换即可接入。</p>

      <h2 id="benchmark">token 基准</h2>
      <p>官方在 core_v1_0 一致性任务集上的测量（Gemini flash 级模型，temperature 0）：</p>
      <table>
        <thead><tr><th scope="col">格式</th><th scope="col">输入 token</th><th scope="col">代码 token</th><th scope="col">Pass@1</th></tr></thead>
        <tbody>
          <tr><td>Direct JSON</td><td>10,980</td><td>807</td><td>98.1%</td></tr>
          <tr><td>Express</td><td>6,000(−45.4%)</td><td>297(−63.2%)</td><td>98.1%</td></tr>
        </tbody>
      </table>
      <p>输入省的是提示词里的格式说明与示例，代码省的是模型输出；准确率与评审得分两种格式持平。
      这就是「模型写的 ≠ 线上跑的」带来的实际收益。格式语法与基准细节见
      <a href="https://a2ui.org/concepts/inference-formats/" target="_blank" rel="noopener">官方 Inference Formats 文档</a>，
      编译器的使用见<a routerLink="/docs/agent-sdk">Agent 集成</a>。</p>
    </div>
  `,
})
export class InferencePage {
  protected readonly expressSnippet = `<a2ui>
$/flight/number = "NH 105"
$/flight/gate = "B12"
root = Card(
  Column([
    Text($/flight/number),
    Text($/flight/gate, "caption"),
    Button(Text("Board now"), action=Event("check_in", {flight: $/flight/number}))
  ])
)
</a2ui>`;

  protected readonly compiledJson = `{
  "version": "1.0",
  "createSurface": {
    "surfaceId": "main",
    "catalogId": "https://a2ui.org/specification/v1_0/catalogs/basic/catalog.json",
    "components": [
      {"id": "root", "component": "Card", "child": "root_child"},
      {"id": "root_child", "component": "Column",
       "children": ["root_child_children_0", "root_child_children_1", "root_child_children_2"]},
      {"id": "root_child_children_0", "component": "Text", "text": {"@path": "/flight/number"}},
      {"id": "root_child_children_1", "component": "Text",
       "text": {"@path": "/flight/gate"}, "variant": "caption"},
      {"id": "root_child_children_2", "component": "Button",
       "child": "root_child_children_2_child",
       "action": {"event": {"name": "check_in", "context": {"flight": {"@path": "/flight/number"}}}}},
      {"id": "root_child_children_2_child", "component": "Text", "text": "Board now"}
    ],
    "dataModel": {"flight": {"number": "NH 105", "gate": "B12"}}
  }
}`;

  protected readonly factoryTs = `import {
  A2uiGenerator, CatalogConfig,
  DirectJsonFormatFactory, ExpressFormatFactory,
} from '@a2ui/agent';

const generator = new A2uiGenerator(
  [new CatalogConfig(catalog)], undefined, new ExpressFormatFactory(),
);
const processor = generator.createProcessor(
  rendererCapabilities, new DirectJsonFormatFactory(),
);`;

  protected readonly factoryPy = `from a2ui.inference_formats import DirectJsonFormatFactory, ExpressFormatFactory
from a2ui.processor import A2uiGenerator, CatalogConfig

generator = A2uiGenerator(
    catalogs=[CatalogConfig(catalog=catalog)],
    inference_format_factory=ExpressFormatFactory(),
)
processor = generator.create_processor(
    renderer_capabilities, inference_format_factory=DirectJsonFormatFactory(),
)`;
}