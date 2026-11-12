import {Component} from '@angular/core';
import {DocsPageHeader} from '../../shared/docs-page-header';
import {RouterLink} from '@angular/router';
import {CodeBlock} from '../../shared/code-block';

@Component({
  selector: 'app-docs-macros',
  imports: [DocsPageHeader, RouterLink, CodeBlock],
  template: `
    <app-docs-page-header eyebrow="指南" heading="使用宏">
        宏在服务端把一次组件调用展开成客户端已支持的基础组件子树：模型少写 token、布局跨回合一致、
        新业务组件只需部署服务端。目前仅 Python Agent SDK 提供，其他语言在计划中。
    </app-docs-page-header>

    <div class="doc-prose">
      <h2 id="why">为什么用宏</h2>
      <ul>
        <li>模型写一行调用，代替嵌套组件树，省输出 token 与延迟。</li>
        <li>层级由服务端代码构建，跨回合布局一致。</li>
        <li>宏是普通 Python：可以拿模型给的 id 查数据库、调 API，再填充组件。</li>
        <li>渲染器只收到它已实现的组件——加宏不需要发客户端版本。</li>
      </ul>

      <h2 id="define">定义宏</h2>
      <p><code>@macro</code> 装饰一个返回单个根 builder 的函数，从类型 hints 与 docstring 的
      Args 块自动生成 schema：</p>
      <app-code lang="python" label="flight_macros.py" [code]="macroPy" />
      <p>模型于是只需要输出一行调用：</p>
      <app-code lang="text" label="模型的 Express 输出" [code]="modelOut" />
      <p>展开后，静态参数被烤进组件，而 <code>$/flight/status</code> 绑定保持活的：
      渲染器收到 Card/Column/Text 基础组件，数据模型变化时状态行照常刷新。</p>

      <h2 id="wire">接入处理器</h2>
      <p>MacroExpander 作用于模型调用两侧：推理前把宏 schema 加进提示词目录，推理后拦截宏调用、
      运行你的函数、发出扁平组件。因此它不放进 CatalogConfig.transformers，而是与处理器并列：</p>
      <app-code lang="python" label="装配 expander 与 processor" [code]="wirePy" />
      <app-code lang="python" label="解析模型输出并展开" [code]="parsePy" />
      <p>多会话服务器里每个会话建一个 MacroExpander（它跟踪各 surface 的活跃目录），
      或给 transform_to_transport 传 surface_catalogs。</p>

      <h2 id="types">参数类型映射</h2>
      <table>
        <thead><tr><th scope="col">Python 注解</th><th scope="col">模型看到的 schema</th><th scope="col">展开时传入</th></tr></thead>
        <tbody>
          <tr><td>str / int / float / bool</td><td>string / integer / number / boolean</td><td>静态字面量，绑定会被校验拒绝</td></tr>
          <tr><td>Literal[...] / Enum</td><td>enum</td><td>静态字面量</td></tr>
          <tr><td>DynamicString / DynamicNumber / DynamicBoolean / DynamicStringList</td><td>对应动态类型</td><td>字面量、@path 或 @call，绑定保持响应式</td></tr>
          <tr><td>Action</td><td>Action</td><td>事件或函数调用对象</td></tr>
          <tr><td>Child / 组件类</td><td>Child</td><td>组件引用</td></tr>
          <tr><td>ChildList / Sequence[Child]</td><td>ChildList</td><td>引用列表；ChildList 另接受动态绑定</td></tr>
          <tr><td>CheckRule</td><td>CheckRule</td><td>校验规则实例</td></tr>
        </tbody>
      </table>

      <h2 id="custom">自定义目录的宏</h2>
      <p>基础目录的 builder 在 <code>a2ui.builder.v1_0</code>；自定义目录用官方 CLI 生成 builder：</p>
      <app-code lang="bash" label="生成 Python builders" [code]="codegenCmd" />
      <p>生成的类可以直接与基础目录组件混用（v1.0 单 surface 多目录），展开时 expander 会移除
      推理用的旁路目录、给每个组件盖上所属 catalogId。目录变更后重跑 codegen，不要手改生成文件。</p>

      <h2 id="caveats">注意事项</h2>
      <ul>
        <li>宏参数是不可信的模型输出：拿 id 查库前先校验。</li>
        <li>默认 <code>on_error="passthrough"</code> 会留下未展开的宏（渲染器画不了）；
          设 <code>on_error="raise"</code> 抛 A2uiValidationError，喂回模型重试。</li>
        <li>同一个 expander 不要混用 v1_0 与 v0_9 的 builder/目录。</li>
        <li>普通类型参数拒绝数据绑定；需要响应式就用 Dynamic* 注解。</li>
      </ul>
      <p>完整 API 与参数映射见
      <a href="https://a2ui.org/guides/macros/" target="_blank" rel="noopener">官方 Macros 指南</a>；
      宏与推理格式的关系见<a routerLink="/docs/inference">推理格式</a>。</p>
    </div>
  `,
})
export class MacrosPage {
  protected readonly macroPy = `from a2ui.builder.v1_0 import Card, Column, DynamicString, Text
from a2ui.transformers.macros import macro

@macro
def FlightCard(flight: str, route: str, status: DynamicString) -> Card:
    """Summary card for a flight with a live status line.

    Args:
        flight: Flight number, such as "OS 87".
        route: Departure and arrival cities, such as "Vienna to New York".
        status: Current status text or data binding.
    """
    return Card(
        child=Column(
            children=[
                Text(text=f"### {flight}"),
                Text(text=route, variant="caption"),
                Text(text=status),
            ]
        )
    )`;

  protected readonly modelOut = `Your flight is boarding.
<a2ui>
$/flight/status = "Boarding"
root = FlightCard("OS 87", "Vienna to New York", $/flight/status)
</a2ui>`;

  protected readonly wirePy = `from a2ui.core.basic_catalog import BasicCatalog
from a2ui.processor import A2uiRequestProcessor
from a2ui.transformers.macros import MacroExpander

from flight_macros import FlightCard

expander = MacroExpander([FlightCard], on_error="raise")
inference_catalog = expander.transform_to_inference_catalog(BasicCatalog("1.0"))

processor = A2uiRequestProcessor(catalogs=[inference_catalog])
system_prompt = processor.prompt_snippet  # 附加进模型系统指令`;

  protected readonly parsePy = `from a2ui.parser import A2uiPart, TextPart

parts = processor.parse_response(llm_output)

text_reply, transport_messages = [], []
for part in parts:
    if isinstance(part, TextPart):
        text_reply.append(part.text)
    elif isinstance(part, A2uiPart):
        transport_messages.extend(expander.transform_to_transport(part.a2ui))

wire_payload = [
    msg.model_dump(by_alias=True, exclude_none=True)
    for msg in transport_messages
]`;

  protected readonly codegenCmd = `a2ui codegen --lang python --catalog travel_catalog.json \\
  --out travel_builders.py --catalog-name travel`;
}