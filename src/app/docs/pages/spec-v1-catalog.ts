import {Component} from '@angular/core';
import {DocsPageHeader} from '../../shared/docs-page-header';
import {RouterLink} from '@angular/router';
import {CodeBlock} from '../../shared/code-block';

@Component({
  selector: 'app-docs-spec-v1-catalog',
  imports: [DocsPageHeader, RouterLink, CodeBlock],
  template: `
    <app-docs-page-header eyebrow="规范 v1.0" heading="基础目录实现指南（v1.0）">
        基础目录是一份可选、可重新样式化的参考目录：18 个组件、15 个渲染器侧函数，
        以及间距、配色与无障碍的实现约定。自定义目录的写法见<a routerLink="/docs/define-catalog">定义目录</a>，原文见
        <a href="https://a2ui.org/specification/v1.0-basic-catalog-implementation-guide/" target="_blank" rel="noopener">官方 Basic Catalog Guide</a>。
    </app-docs-page-header>

    <div class="doc-prose">
      <h2 id="naming">标识符规则</h2>
      <p>所有目录实体——组件类型、函数名、参数与属性名——必须满足 UAX #31 变量名规则：
      以 XID_Start 或 <code>_</code> 开头，后续为 XID_Continue，不含符号与空白：</p>
      <app-code lang="text" label="规范校验正则" [code]="identRegex" />

      <h2 id="media-text">组件：文本与媒体</h2>
      <table>
        <thead><tr><th scope="col">组件</th><th scope="col">关键属性</th><th scope="col">行为要点</th></tr></thead>
        <tbody>
          <tr><td><code>Text</code></td><td><code>text</code>（动态字符串，轻量 Markdown）、<code>variant</code>（caption / body，默认 body）、<code>weight</code></td><td>优先 Markdown 渲染，失败回退纯文本；caption 约 0.8× 基础字号并弱化。</td></tr>
          <tr><td><code>Image</code></td><td><code>url</code>、<code>description</code>（无障碍文本）、<code>fit</code>（contain/cover/fill/none/scaleDown，默认 fill）、<code>variant</code>（icon/avatar/smallFeature/mediumFeature/largeFeature/header）</td><td>填满容器宽度；variant 暗示尺寸：icon 约 24×24、avatar 约 40×40 圆角、header 全宽约 200dp 高。</td></tr>
          <tr><td><code>Icon</code></td><td><code>name</code>（固定图标名枚举、<code>&#123;svgPath&#125;</code> 或绑定）</td><td>映射到平台图标集；建议 24dp 并继承文本颜色。</td></tr>
          <tr><td><code>Video</code></td><td><code>url</code>、<code>posterUrl</code></td><td>原生播放器带控制条，全宽，支持 seek。</td></tr>
          <tr><td><code>AudioPlayer</code></td><td><code>url</code>、<code>description</code></td><td>原生音频播放器带控制条，全宽，支持 seek。</td></tr>
        </tbody>
      </table>

      <h2 id="layout">组件：布局</h2>
      <table>
        <thead><tr><th scope="col">组件</th><th scope="col">关键属性</th><th scope="col">行为要点</th></tr></thead>
        <tbody>
          <tr><td><code>Row</code> / <code>Column</code></td><td><code>children</code>、<code>justify</code>（start/center/end/spaceAround/spaceBetween/spaceEvenly/stretch）、<code>align</code>（start/center/end/stretch）</td><td>水平 / 垂直布局，占满可用宽度；justify 主轴、align 交叉轴。</td></tr>
          <tr><td><code>List</code></td><td><code>children</code>、<code>direction</code>（vertical 默认 / horizontal）、<code>align</code></td><td>可滚动；横向模式约束子项最大宽度；尽量隐藏滚动条。</td></tr>
          <tr><td><code>Card</code></td><td><code>child</code>（恰好一个）</td><td>区分背景、约 8–12dp 圆角、轻阴影、约 16dp 内边距；多元素需容器子组件。</td></tr>
          <tr><td><code>Tabs</code></td><td><code>tabs</code>（<code>&#123;title, child&#125;</code> 数组，至少一项）</td><td>横向标签头；高亮活跃标签；本地维护 selectedIndex（默认 0），只渲染匹配子项。</td></tr>
          <tr><td><code>Divider</code></td><td><code>axis</code>（horizontal 默认 / vertical）</td><td>1dp 弱色线；垂直方向撑满容器高度。</td></tr>
          <tr><td><code>Modal</code></td><td><code>trigger</code>、<code>content</code></td><td>入口组件：初始只显示 trigger，交互后打开 content。桌面居中对话框加暗化背景，移动底部 sheet 或全屏；必须提供关闭方式。</td></tr>
        </tbody>
      </table>

      <h2 id="inputs">组件：输入与动作</h2>
      <table>
        <thead><tr><th scope="col">组件</th><th scope="col">关键属性</th><th scope="col">行为要点</th></tr></thead>
        <tbody>
          <tr><td><code>Button</code></td><td><code>child</code>（Text，或纯图标时 Icon）、<code>variant</code>（default/primary/borderless）、<code>action</code>；继承 Checkable</td><td>原生按钮；点击时解析 context 变量并派发 action；primary 用主题主色加对比文本，borderless 似链接。</td></tr>
          <tr><td><code>TextField</code></td><td><code>label</code>、<code>value</code>（必填，双向）、<code>placeholder</code>、<code>variant</code>（shortText 默认 / longText / number / obscured）</td><td>每次击键写回绑定路径；number 在移动端弹出 numeric 键盘。</td></tr>
          <tr><td><code>CheckBox</code></td><td><code>label</code>、<code>value</code>（动态布尔，双向）</td><td>原生复选框或开关，写回 true/false。</td></tr>
          <tr><td><code>ChoicePicker</code></td><td><code>options</code>（<code>&#123;label, value&#125;</code>）、<code>value</code>（字符串数组，双向）、<code>variant</code>（mutuallyExclusive 默认 / multipleSelection）、<code>displayStyle</code>（checkbox 默认 / chips）、<code>filterable</code></td><td>复选/单选列表或换行 chips；filterable 时按 label 不区分大小写子串过滤。</td></tr>
          <tr><td><code>Slider</code></td><td><code>max</code>（必填）、<code>min</code>（默认 0）、<code>value</code>（动态数字，双向）、<code>steps</code>（≥1 整数，吸附）</td><td>原生滑杆；值为数字，允许小数；可选显示当前值。</td></tr>
          <tr><td><code>DateTimeInput</code></td><td><code>value</code>（ISO 8601 字符串，未设为空串）、<code>enableDate</code> / <code>enableTime</code>（默认 false）、<code>min</code> / <code>max</code>、<code>label</code></td><td>按开关显示日期/时间选择器；在原生格式与 ISO 8601 之间转换。</td></tr>
        </tbody>
      </table>

      <h2 id="media-validation">媒体 URL 校验（Image / Video / AudioPlayer 强制）</h2>
      <ol>
        <li>trim 空白与控制字符；空串拒绝。</li>
        <li>只允许 <code>http:</code>、<code>https:</code>、<code>data:</code> 与相对路径；其余不渲染（不报错）。</li>
        <li>HTTP URL 必须 <code>//</code> 加非空 host；拒绝 <code>https:host</code> 这类形式。</li>
        <li>拒绝协议相对路径（<code>//host</code>，把 <code>\\</code> 视作 <code>/</code>），检查前先去掉 tab/换行/CR。</li>
        <li>廉价校验：只看 scheme 前缀，<code>data:</code> URL 可能极大，不要全量解析。</li>
      </ol>

      <h2 id="functions">渲染器侧函数</h2>
      <table>
        <thead><tr><th scope="col">函数</th><th scope="col">签名与语义</th></tr></thead>
        <tbody>
          <tr><td><code>@index</code></td><td>可选 <code>offset</code>（默认 0）加到 0 基循环索引；仅在模板迭代内有效。</td></tr>
          <tr><td><code>formatString</code></td><td>解析 <code>value</code> 中的 <code>\$&#123;expression&#125;</code> 块；<code>\\\$&#123;</code> 转义为字面量。表达式可为字面量、数据路径或 <code>funcName(arg: value)</code> 调用；必须返回响应式计算值，嵌套订阅自行管理。</td></tr>
          <tr><td><code>required</code></td><td>非 null / undefined / 空串 / 空数组即 true。</td></tr>
          <tr><td><code>regex</code></td><td><code>value</code> + <code>pattern</code>；安全方言见下节；返回 ValidationResult。</td></tr>
          <tr><td><code>length</code></td><td><code>value</code> + <code>min</code> / <code>max</code> 至少其一：字符串长度在界内。</td></tr>
          <tr><td><code>numeric</code></td><td><code>value</code> + <code>min</code> / <code>max</code> 至少其一：可解析数字且在界内。</td></tr>
          <tr><td><code>email</code></td><td>标准邮箱正则测试。</td></tr>
          <tr><td><code>formatNumber</code></td><td><code>value</code> + 可选 <code>decimals</code>、<code>grouping</code>（默认 true）；按 locale 格式化。</td></tr>
          <tr><td><code>formatCurrency</code></td><td><code>value</code> + <code>currency</code>（ISO 4217）+ 可选 decimals / grouping。</td></tr>
          <tr><td><code>formatDate</code></td><td><code>value</code> + <code>format</code>（Unicode TR35）；支持 yy/yyyy、M/MM/MMM/MMMM、d/dd/E/EEEE、h/hh（需 a）、H/HH、mm、ss、a。</td></tr>
          <tr><td><code>pluralize</code></td><td><code>value</code> + 必填 <code>other</code> 回退，可选 zero/one/two/few/many；按 locale 的 CLDR 复数类别。</td></tr>
          <tr><td><code>openUrl</code></td><td><code>url</code>；void 副作用；requiresUserActivation；解析相对 URL，只允许 http/https，新标签用 <code>noopener,noreferrer</code>。</td></tr>
          <tr><td><code>and</code> / <code>or</code></td><td><code>values</code> 布尔数组（≥2）；全真 / 任一真；鼓励短路。</td></tr>
          <tr><td><code>not</code></td><td>严格布尔取反。</td></tr>
        </tbody>
      </table>

      <h2 id="regex">regex 的安全方言</h2>
      <ul>
        <li>可移植 ECMAScript 子集，Unicode <code>u</code> 模式，无 flags；search 语义。</li>
        <li>拒绝：反向引用、lookbehind、命名组、<code>\\p&#123;...&#125;</code>、<code>\\cX</code>、八进制转义、内联 flags → <code>EXPRESSION_ERROR</code>。</li>
        <li>静态安全检查：超过 256 码点的 pattern、灾难性回溯形状直接拒绝。</li>
        <li>超过 4096 码点的 value 不求值，直接返回 <code>&#123;"valid": false&#125;</code>。</li>
      </ul>

      <h2 id="theming">主题与间距</h2>
      <ul>
        <li><strong>叶节点外边距策略</strong>（避免嵌套容器间距相乘）：不可见容器（Row/Column/List）零 padding 零 margin；
        视觉叶组件（Text/Image/Icon/Video/AudioPlayer/Slider 等）统一外边距（如 8dp）；
        有边框的容器与输入（Card/Button/TextField/CheckBox/ChoicePicker）同样外边距，再加相对自身边框的内边距。</li>
        <li><strong>颜色靠继承，不向下传</strong>：CSS <code>color</code>、Compose LocalContentColor、SwiftUI foregroundColor、Flutter DefaultTextStyle/IconTheme merge。
        强色容器（如 primary Button）设置预期内容色，嵌套 Text/Icon 自动适应；叶组件不得硬编码颜色。</li>
        <li>Card 推荐透明背景加 1dp 描边，嵌套卡片无需深度跟踪即可区分；也可用框架 elevation。</li>
      </ul>

      <h2 id="a11y">无障碍</h2>
      <ul>
        <li><code>Image.description</code> 是图像无障碍文本；输入组件的 <code>label</code> 提供可见/可访问标签。</li>
        <li>无障碍属性必须接到平台 API；显式属性覆盖推断标签；v1.0 增加 WAI-ARIA <code>live</code>（off/polite/assertive）与 <code>hidden</code>。</li>
        <li>Tabs 必须有视觉活跃指示；Modal 必须有关闭 affordance；媒体校验失败渲染空或平台占位，不报错。</li>
      </ul>

      <h2 id="impl">渲染器实现要求</h2>
      <ul>
        <li>输入、媒体、列表优先用框架/平台原生控件；五个输入组件实现双向绑定，交互即写回。</li>
        <li>Button 的 action 与 context 在交互时解析；所有动态属性响应式，含嵌套 formatString。</li>
        <li>严格执行媒体 URL 与 openUrl 安全约束；regex 先校验再匹配并执行长度上限。</li>
        <li>Tabs 与 Modal 状态留在本地（selectedIndex、开/关）；遵循叶节点间距与继承配色。</li>
        <li>基础目录是参考：生产应用可以重新样式化或定义自定义目录。</li>
      </ul>
    </div>
  `,
})
export class SpecV1CatalogPage {
  protected readonly identRegex = '^[\\p{XID_Start}_][\\p{XID_Continue}]*$';
}