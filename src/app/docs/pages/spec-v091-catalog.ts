import {Component} from '@angular/core';
import {DocsPageHeader} from '../../shared/docs-page-header';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-docs-spec-v091-catalog',
  imports: [DocsPageHeader, RouterLink],
  template: `
    <app-docs-page-header eyebrow="规范 v0.9.1" heading="基础目录实现指南(v0.9.1)">
        v0.9.1 基础目录：18 个组件、14 个渲染器侧函数，以及间距、配色与无障碍的实现约定。
        目录 <code>$id</code> 保留 <code>https://a2ui.org/specification/v0_9/catalogs/basic/catalog.json</code>,
        源码位于 <code>specification/v0_9_1/catalogs/basic/catalog.json</code>。原文见
        <a href="https://a2ui.org/specification/v0.9.1-basic-catalog-implementation-guide/" target="_blank" rel="noopener">官方 v0.9.1 Basic Catalog Guide</a>。
    </app-docs-page-header>

    <div class="doc-prose">
      <h2 id="identity">目录身份与结构</h2>
      <ul>
        <li>基础目录是<strong>可选、可重新样式化</strong>的参考：应用可以重设组件外观，或构建领域目录。</li>
        <li>每个组件用 <code>allOf</code> 组合 ComponentCommon(id / accessibility)与 CatalogComponentCommon(<code>weight</code>),
        并以 <code>unevaluatedProperties: false</code> 拒绝未知属性。<code>weight</code> 类似 CSS flex-grow,<strong>只能</strong>设在 Row / Column 的直接子组件上。</li>
        <li>子组件不能内联定义，必须按 ID 引用；<code>anyComponent</code> / <code>anyFunction</code> 分别是按 <code>component</code> / <code>call</code> 判别的 oneOf。</li>
        <li>动态类型引用 <code>common_types.json#/$defs/…</code>:DynamicString / DynamicBoolean / DynamicNumber / DynamicStringList / DynamicValue / DataBinding / ChildList / Checkable / Action。</li>
      </ul>

      <h2 id="media-text">组件：文本与媒体</h2>
      <table>
        <thead><tr><th scope="col">组件</th><th scope="col">关键属性</th><th scope="col">行为要点</th></tr></thead>
        <tbody>
          <tr><td><code>Text</code></td><td><code>text</code>(动态字符串，轻量 Markdown)、<code>variant</code>(h1 / h2 / h3 / h4 / h5 / caption / body，默认 body)</td><td>优先 Markdown 渲染，失败回退纯文本并去掉 <code>**</code>、<code>#</code> 等标记。建议字号：h1 2.5×、h2 2×、h3 1.75×、h4 1.5×、h5 1.25×、caption 0.8×(弱化斜体)。</td></tr>
          <tr><td><code>Image</code></td><td><code>url</code> 必填；<code>description</code>(无障碍文本)、<code>fit</code>(contain/cover/fill/none/scaleDown，默认 fill)、<code>variant</code>(icon/avatar/smallFeature/mediumFeature/largeFeature/header，默认 mediumFeature)</td><td>默认弹性宽度填满容器；variant 暗示尺寸：icon 24×24dp、avatar 40×40dp 圆角、header 全宽约 200dp 高 cover。</td></tr>
          <tr><td><code>Icon</code></td><td><code>name</code>:60 个命名图标枚举、<code>&#123;svgPath&#125;</code> 对象或数据绑定</td><td>映射到平台图标集(camelCase 必要时转 snake_case);24dp，继承文本颜色(currentColor)。</td></tr>
          <tr><td><code>Video</code></td><td>仅 <code>url</code></td><td>原生播放器带控制条，全宽，支持 seek。</td></tr>
          <tr><td><code>AudioPlayer</code></td><td><code>url</code>、可选 <code>description</code></td><td>原生音频播放器带控制条，全宽，支持 seek。</td></tr>
        </tbody>
      </table>

      <h2 id="media-validation">媒体 URL 校验(Image / Video / AudioPlayer 强制)</h2>
      <ol>
        <li>trim 空白与控制字符；空串拒绝。</li>
        <li>只允许 <code>http:</code>、<code>https:</code>、<code>data:</code> 与相对路径；其余静默拒绝(不报错，渲染空或占位)。</li>
        <li>HTTP URL 必须 <code>//</code> 加非空 host；拒绝 <code>https:host</code> 这类形式。</li>
        <li>拒绝协议相对路径(<code>//host</code>，把 <code>\\</code> 视作 <code>/</code>),检查前先去掉 tab/换行/CR(与浏览器行为一致)。</li>
        <li>廉价校验：只看 scheme 前缀与开头字符，<code>data:</code> URL 可能极大，不要全量复制解析。</li>
      </ol>

      <h2 id="layout">组件：布局</h2>
      <table>
        <thead><tr><th scope="col">组件</th><th scope="col">关键属性</th><th scope="col">行为要点</th></tr></thead>
        <tbody>
          <tr><td><code>Row</code> / <code>Column</code></td><td><code>children</code>(ChildList)、<code>justify</code>(start 默认 / center / end / spaceAround / spaceBetween / spaceEvenly / stretch)、<code>align</code>(stretch 默认 / start / center / end)</td><td>水平 / 垂直布局，占满可用宽度；justify 主轴、align 交叉轴；网格用 Row 套 Column(或反之)。</td></tr>
          <tr><td><code>List</code></td><td><code>children</code>、<code>direction</code>(vertical 默认 / horizontal)、<code>align</code></td><td>横向模式约束子项最大宽度；尽量隐藏横向滚动条。</td></tr>
          <tr><td><code>Card</code></td><td><code>child</code>(恰好一个 ComponentId)</td><td>区分背景、8–12dp 圆角、轻阴影、16dp 内边距；多元素需先包一层布局组件。</td></tr>
          <tr><td><code>Tabs</code></td><td><code>tabs</code>(<code>&#123;title, child&#125;</code> 数组，至少一项)</td><td>横向标签头加活跃指示；本地 selectedIndex 默认 0，只渲染匹配子项。</td></tr>
          <tr><td><code>Modal</code></td><td><code>trigger</code>、<code>content</code>(均 ComponentId)</td><td>初始只显示 trigger，点击打开 content；桌面居中对话框加暗化背景，移动底部 sheet 或全屏；必须提供关闭方式(X、点背景或滑动)。</td></tr>
          <tr><td><code>Divider</code></td><td><code>axis</code>(horizontal 默认 / vertical)</td><td>水平 1dp 高全宽弱色线；垂直 1dp 宽撑满容器高度。</td></tr>
        </tbody>
      </table>

      <h2 id="inputs">组件：输入与动作</h2>
      <table>
        <thead><tr><th scope="col">组件</th><th scope="col">关键属性</th><th scope="col">行为要点</th></tr></thead>
        <tbody>
          <tr><td><code>Button</code></td><td><code>child</code> 与 <code>action</code> 必填；<code>variant</code>(default 默认 / primary / borderless);继承 Checkable</td><td>原生按钮包裹 child(通常 Text，纯图标时用 Icon);点击时解析 context 并派发 action。primary 用主题 primaryColor 背景加对比文本，borderless 似链接；内容色设在包装层，叶组件不硬编码。</td></tr>
          <tr><td><code>TextField</code></td><td><code>label</code> 必填；<code>value</code>(双向)、<code>variant</code>(shortText 默认 / longText / number / obscured)、<code>validationRegexp</code>(客户端正则)均可选；继承 Checkable</td><td>击键即写回绑定；number 弹出数字键盘，obscured 为密码样式；校验也可走 checks。</td></tr>
          <tr><td><code>CheckBox</code></td><td><code>label</code>、<code>value</code>(动态布尔)均必填；继承 Checkable</td><td>双向绑定写回 true / false。</td></tr>
          <tr><td><code>ChoicePicker</code></td><td><code>options</code>(<code>&#123;label, value&#125;</code> 数组)与 <code>value</code>(字符串数组)必填；可选 <code>label</code>、<code>variant</code>(mutuallyExclusive 默认 / multipleSelection)、<code>displayStyle</code>(checkbox 默认 / chips)、<code>filterable</code>(默认 false);继承 Checkable</td><td>checkbox 优先下拉选择器，chips 为换行胶囊加选中态；filterable 加文本框按不区分大小写子串过滤；交互即切换数组成员。</td></tr>
          <tr><td><code>Slider</code></td><td><code>value</code>(动态数字)与 <code>max</code> 必填；可选 <code>label</code>、<code>min</code>(默认 0);继承 Checkable</td><td>双向绑定；值为数字允许小数；可选显示当前值。</td></tr>
          <tr><td><code>DateTimeInput</code></td><td><code>value</code>(ISO 8601 字符串，未设初始化为 <code>""</code>)必填；可选 <code>enableDate</code> / <code>enableTime</code>(默认 false)、<code>min</code> / <code>max</code>(字符串时须为 date / time / date-time 格式)、<code>label</code>；继承 Checkable</td><td>按开关渲染日期、时间或两者；读写时在原生格式与 ISO 8601 之间转换。</td></tr>
        </tbody>
      </table>

      <h2 id="theme">主题(createSurface.theme)</h2>
      <p>v0.9.1 的 <code>createSurface</code> 可携带 <code>theme</code> 对象(v1.0 已移除该字段),<code>$defs</code> 定义三个可选键：</p>
      <ul>
        <li><code>primaryColor</code>:六位十六进制色，模式 <code>^#[0-9a-fA-F]&#123;6&#125;$</code>；用于高亮与 primary 按钮，渲染器可派生变体色。</li>
        <li><code>iconUrl</code>(URI):标识该 surface 所属智能体/工具的图像。</li>
        <li><code>agentDisplayName</code>:显示在 surface 旁的名称标签。</li>
      </ul>

      <h2 id="functions">渲染器侧函数(14 个)</h2>
      <table>
        <thead><tr><th scope="col">函数</th><th scope="col">签名与语义</th></tr></thead>
        <tbody>
          <tr><td><code>formatString</code></td><td>必填 <code>value</code>；解析 <code>\$&#123;expression&#125;</code> 块，<code>\\\$&#123;</code> 转义为字面量。表达式支持引号字面量、数字、true/false/null、绝对/相对数据路径与 <code>funcName(arg: value)</code> 调用；必须返回响应式计算流，逐 token 解析为信号再拼接。</td></tr>
          <tr><td><code>required</code></td><td><code>value</code>；非 null / undefined / 空串 / 空数组即 true。</td></tr>
          <tr><td><code>regex</code></td><td><code>value</code> + <code>pattern</code>；返回布尔匹配结果。</td></tr>
          <tr><td><code>length</code></td><td><code>value</code> + <code>min</code> / <code>max</code>(≥0 整数)至少其一；字符串长度在界内。</td></tr>
          <tr><td><code>numeric</code></td><td><code>value</code> + <code>min</code> / <code>max</code> 至少其一；不可解析或越界为 false。</td></tr>
          <tr><td><code>email</code></td><td><code>value</code>；标准邮箱模式测试。</td></tr>
          <tr><td><code>formatNumber</code></td><td><code>value</code> + 可选 <code>decimals</code>(强制小数位)、<code>grouping</code>(默认 true);按原生 locale 格式化，小数位默认随 locale 取 0 或 2。</td></tr>
          <tr><td><code>formatCurrency</code></td><td><code>value</code> + <code>currency</code>(ISO 4217)+ 可选 decimals / grouping。</td></tr>
          <tr><td><code>formatDate</code></td><td><code>value</code> + <code>format</code>(Unicode TR35);支持 yy/yyyy、M/MM/MMM/MMMM、d/dd/E/EEEE、h/hh(需 a)、H/HH、mm、ss、a。如 <code>'MMM dd, yyyy'</code> → Jan 16, 2026。</td></tr>
          <tr><td><code>pluralize</code></td><td><code>value</code> + 必填 <code>other</code> 回退，可选 zero/one/two/few/many；按 CLDR 复数类别。</td></tr>
          <tr><td><code>openUrl</code></td><td><code>url</code>(URI);void 副作用。强制安全：先按环境解析相对 URL，解析后只允许 http/https，否则抛错(如 A2uiExpressionError)中止；新标签必须 <code>noopener,noreferrer</code>。</td></tr>
          <tr><td><code>and</code> / <code>or</code></td><td><code>values</code> 布尔数组(≥2);全真 / 任一真；鼓励短路。</td></tr>
          <tr><td><code>not</code></td><td><code>value</code>；严格布尔取反。</td></tr>
        </tbody>
      </table>

      <h2 id="spacing">间距、配色与无障碍</h2>
      <ul>
        <li><strong>叶节点外边距策略</strong>:不可见容器(Row/Column/List)零 padding 零 margin;
        视觉叶组件(Text/Image/Icon/Video/AudioPlayer/Slider 等)统一外边距(如四边 8dp);
        有边框的容器与输入(Card/Button/TextField/CheckBox/ChoicePicker)同样外边距，再加自身内边距——避免嵌套时间距相乘。</li>
        <li><strong>颜色靠原生继承</strong>:不手工计算或向下传色；Text / Icon 除非属性明确要求，不得硬编码颜色;
        primary Button 在包装层设置对比内容色(CSS color、Compose LocalContentColor、SwiftUI foregroundColor、Flutter DefaultTextStyle/IconTheme merge)。</li>
        <li>Card 推荐透明背景加 1dp 描边，任意嵌套深度都可区分；也可用框架 elevation，避免按深度交替表面色。</li>
        <li>无障碍：<code>Image.description</code> 提供图像文本；媒体用原生控制条；输入用原生控件与可见 label;Modal 必须有关闭方式；primary 按钮保证对比度。</li>
      </ul>

      <h2 id="diff">与 v1.0 基础目录的差异</h2>
      <table>
        <thead><tr><th scope="col">主题</th><th scope="col">v0.9.1</th><th scope="col">v1.0</th></tr></thead>
        <tbody>
          <tr><td>Text variant</td><td>h1–h5 / caption / body</td><td>caption / body</td></tr>
          <tr><td>TextField</td><td>label 必填，value 可选，<code>validationRegexp</code> 客户端正则</td><td>value 必填，新增 <code>placeholder</code>，校验走 checks</td></tr>
          <tr><td>Video</td><td>仅 url</td><td>新增 <code>posterUrl</code></td></tr>
          <tr><td>Slider</td><td>无级滑动</td><td>新增 <code>steps</code> 吸附</td></tr>
          <tr><td>函数</td><td>14 个</td><td>15 个(新增 <code>@index</code> 模板索引)</td></tr>
          <tr><td>主题</td><td><code>createSurface.theme</code>(primaryColor / iconUrl / agentDisplayName)</td><td>theme 字段移除</td></tr>
          <tr><td>regex 返回值</td><td>布尔</td><td>ValidationResult(含 message)</td></tr>
        </tbody>
      </table>
      <p>迁移步骤见<a routerLink="/docs/spec-v1-evolution">v1.0 演进指南</a>;
      当前版本的完整目录见<a routerLink="/docs/spec-v1-catalog">v1.0 基础目录指南</a>。</p>
    </div>
  `,
})
export class SpecV091CatalogPage {}