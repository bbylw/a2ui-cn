# A2UI

**构建令人愉悦、快速、可靠的智能体体验**

A2UI（Agent-to-User Interface）是一个开源生成式 UI 框架，包含为低延迟流式传输动态界面而优化的协议、面向 Web 与移动框架的原生渲染器，以及多种主流语言的 Agent SDK。借助 A2UI，智能体除了文本，还能用原生渲染的组件与用户交流。

<img src="https://raw.githubusercontent.com/a2ui-project/a2ui/main/docs/assets/a2ui_gallery_examples.png" alt="A2UI 组件画廊" height="400">

_A2UI 能表达的界面组合示例。_

## 快速链接

- [主站](https://a2ui.org)。
- 在浏览器中用 [A2UI Composer](https://a2ui-project.github.io/composer/) 试用。
- [支持的渲染器](https://a2ui.org/reference/renderers/)。
- [支持的智能体](https://a2ui.org/reference/agents/)。
- [协议规范](https://a2ui.org/specification/v1.0-a2ui/)。

## 简介

大语言模型（LLM）与决策模型（如 [Jev](https://docs.typesafe.ai/)）擅长生成文本与代码，也擅长在原始结构化数据（如 JSON）之上快速做出决策。A2UI 为这些模型提供了表达用户界面的专用词汇。

A2UI 用**数据**而非代码表达界面。智能体与渲染器之间交换数据的 schema 为智能体划定了严格的能力边界，使智能体生成的体验既安全，又与你的应用业务要求保持一致。**核心库**、**原生框架适配器**与**组件目录**提供对原生组件的访问，并构成智能体**组合**出最终用户体验的积木，让结果既富有表现力又具备高性能。

## 何时使用 A2UI

当你的应用满足以下任一情况时，适合使用 A2UI：

- 应用的某些部分由智能体和/或服务端驱动。A2UI 在设计上支持远程渲染。
- 你希望界面动态组合，贴合用户当下的需求。与其让用户在多个页面之间跳转来解决问题，不如让智能体构建恰当的界面流程，把用户直接引向解决方案。
- 你需要最高的性能与视觉保真度。A2UI 用你选择的框架渲染界面，通常就是宿主应用本身所用的框架，无需 WebView 或 HTML。
- 同一个智能体向多个平台或框架流式输出界面，例如 Flutter、React、SwiftUI 与 Jetpack Compose。A2UI 帮助所有屏幕上的体验保持兼容与一致。
- 智能体是远程的、第三方的，或者需要跨越信任边界。例如智能体不得处理某些类型的数据（信用卡号/账号、PII、金融数据）。A2UI 通过严格的 schema，并用经过校验的数据而非可执行代码来表达界面，帮助守住信任边界，保护应用的关键功能不被幻觉影响。

## A2UI 核心理念

我们在以下核心原则的指导下开发 A2UI：

- **安全优先**：应用开发者掌控智能体在应用里能做什么、不能做什么。A2UI 提供用于指定并执行必要护栏的框架，例如把界面表达为数据、按 schema 校验输入与输出、禁止任意可执行代码。授予智能体的每一项能力，要么是框架内置的安全标准能力，要么是应用开发者显式授予的能力。
- **模型友好、服务端驱动**：A2UI 协议在设计上便于语言模型与决策模型高效生成、便于在网络中传输，并支持渐进式渲染（即“流式”），带来响应迅速的用户体验。智能体可以根据用户把对话引向何处来调整界面。A2UI 支持可替换的推理格式，便于针对特定模型与场景定制推理。
- **原生渲染与可移植性**：A2UI 用应用原生的框架渲染界面，并为众多主流 UI 框架提供渲染器。除非另有原因，无需更换框架。

## 架构

A2UI 的架构由贯穿全栈的多层组成，把智能体与应用连接起来：

1. **推理**：智能体（通常由语言模型或决策模型驱动）在 A2UI 技能（用 A2UI Agent SDK 创建）的指导下，使用合适的推理格式（如 A2UI Express，或决策树）生成界面与数据的描述。
2. **传输**：嵌入在更大智能体架构中的 A2UI Agent SDK 解析并校验模型输出、展开宏，再把界面转换为可稳定传输的 _A2UI Transport_ 协议消息，发送给渲染器。
3. **渲染**：渲染器由 _A2UI Core_ 库（如 `@a2ui/web_core` npm 包或 `a2ui_core` Dart 包）、UI 框架适配器（如 `@a2ui/react` React 适配器或 `a2ui_flutter` Flutter 适配器）与组件目录组成。核心库解析传入的消息，创建与框架无关的界面与数据内存表示；框架适配器把内存表示映射为具体的框架 UI 组件；组件目录提供智能体被允许组合使用的组件。

## 入门

选择适合你的起点：

| 路径                                                             | 你能获得什么                                                            | 耗时    |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------- | ------- |
| 🍜 **[快速开始](https://a2ui.org/quickstart/)**                  | 一个前后端齐全的 A2UI 全栈应用。端到端了解 A2UI，并按你的场景定制。     | ~5 分钟 |
| 🎨 **[A2UI Composer](https://a2ui-project.github.io/composer/)** | 在可视化编辑器中生成 A2UI JSON，粘贴进任意智能体的提示词——无需安装。    | ~1 分钟 |
| 🎬 **[A2UI Theater](https://a2ui-composer.ag-ui.com/theater)**   | 在 Lit、React、Angular 渲染器上逐步播放预置的 A2UI 流式场景——无需安装。 | ~1 分钟 |

## 包

这些包在本仓库中开发。标注“尚未发布”的包可直接从源码使用。

### Python

| 包                                                                                  | 说明                                                                                       | 版本                                                                                                  |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| [a2ui-core](https://github.com/a2ui-project/a2ui/tree/main/python/a2ui_core/)       | 协议消息、数据模型、数据绑定、表达式求值与目录校验。                                       | [![PyPI](https://img.shields.io/pypi/v/a2ui-core.svg)](https://pypi.org/project/a2ui-core/)           |
| [a2ui-agent-sdk](https://github.com/a2ui-project/a2ui/tree/main/python/a2ui_agent/) | Agent SDK：协商目录、生成提示词与技能，并把模型输出编译为 A2UI。                           | [![PyPI](https://img.shields.io/pypi/v/a2ui-agent-sdk.svg)](https://pypi.org/project/a2ui-agent-sdk/) |
| [a2ui-a2a](https://github.com/a2ui-project/a2ui/tree/main/python/a2ui_a2a/)         | 把 Agent SDK 连接到 [Agent-to-Agent（A2A）协议](https://a2a-protocol.org)。                | [![PyPI](https://img.shields.io/pypi/v/a2ui-a2a.svg)](https://pypi.org/project/a2ui-a2a/)             |
| [a2ui-adk](https://github.com/a2ui-project/a2ui/tree/main/python/a2ui_adk/)         | 把 Agent SDK 连接到 [Agent Development Kit（ADK）](https://github.com/google/adk-python)。 | [![PyPI](https://img.shields.io/pypi/v/a2ui-adk.svg)](https://pypi.org/project/a2ui-adk/)             |

### TypeScript

| 包                                                                                                       | 说明                                                                  | 版本                                                                                                          |
| -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| [@a2ui/web_core](https://github.com/a2ui-project/a2ui/tree/main/typescript/core/web_core/)               | 渲染器与 `@a2ui/agent` 共享的协议消息、状态管理、表达式与基础目录。   | [![npm](https://img.shields.io/npm/v/@a2ui/web_core.svg)](https://www.npmjs.com/package/@a2ui/web_core)       |
| [@a2ui/lit](https://github.com/a2ui-project/a2ui/tree/main/typescript/renderers/lit/)                    | Lit（Web Components）渲染器。                                         | [![npm](https://img.shields.io/npm/v/@a2ui/lit.svg)](https://www.npmjs.com/package/@a2ui/lit)                 |
| [@a2ui/angular](https://github.com/a2ui-project/a2ui/tree/main/typescript/renderers/angular/)            | Angular 渲染器。                                                      | [![npm](https://img.shields.io/npm/v/@a2ui/angular.svg)](https://www.npmjs.com/package/@a2ui/angular)         |
| [@a2ui/react](https://github.com/a2ui-project/a2ui/tree/main/typescript/renderers/react/)                | React 渲染器。                                                        | [![npm](https://img.shields.io/npm/v/@a2ui/react.svg)](https://www.npmjs.com/package/@a2ui/react)             |
| [@a2ui/markdown-it](https://github.com/a2ui-project/a2ui/tree/main/typescript/renderers/markdown-it/)    | 基于 markdown-it 与 DOMPurify 的 Markdown 渲染，供 Web 渲染器共享。   | [![npm](https://img.shields.io/npm/v/@a2ui/markdown-it.svg)](https://www.npmjs.com/package/@a2ui/markdown-it) |
| [@a2ui/agent](https://github.com/a2ui-project/a2ui/tree/main/typescript/agents/a2ui_agent/)              | Agent SDK：协商目录、生成提示词与技能，并把模型输出编译为 A2UI。      | [![npm](https://img.shields.io/npm/v/@a2ui/agent.svg)](https://www.npmjs.com/package/@a2ui/agent)             |
| [@a2ui/catalog-mcp](https://github.com/a2ui-project/a2ui/tree/main/typescript/catalogs/mcp/)             | MCP 目录：调用 MCP 工具，并渲染工具结果与 UI 资源中返回的 A2UI 消息。 | [![npm](https://img.shields.io/npm/v/@a2ui/catalog-mcp.svg)](https://www.npmjs.com/package/@a2ui/catalog-mcp) |
| [@a2ui/catalog-vegachart](https://github.com/a2ui-project/a2ui/tree/main/typescript/catalogs/vegachart/) | VegaChart 目录：在 A2UI surface 上渲染 Vega 与 Vega-Lite 图表规范。   | 尚未发布                                                                                                      |

### Dart 与 Flutter

| 包                                                                                | 说明                                                             | 版本                                                                                           |
| --------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| [a2ui_core](https://github.com/a2ui-project/a2ui/tree/main/dart/a2ui_core/)       | 面向渲染器与智能体的协议消息、数据模型、数据绑定与表达式。       | [![pub](https://img.shields.io/pub/v/a2ui_core.svg)](https://pub.dev/packages/a2ui_core)       |
| [a2ui_agent](https://github.com/a2ui-project/a2ui/tree/main/dart/a2ui_agent/)     | Agent SDK：协商目录、生成提示词与技能，并把模型输出编译为 A2UI。 | [![pub](https://img.shields.io/pub/v/a2ui_agent.svg)](https://pub.dev/packages/a2ui_agent)     |
| [a2ui_flutter](https://github.com/a2ui-project/a2ui/tree/main/dart/a2ui_flutter/) | Flutter 渲染器。                                                 | [![pub](https://img.shields.io/pub/v/a2ui_flutter.svg)](https://pub.dev/packages/a2ui_flutter) |
| [a2ui_cli](https://github.com/a2ui-project/a2ui/tree/main/dart/a2ui_cli/)         | 开发者工具，从目录生成类型安全的组件代码。                       | [GitHub Releases](https://github.com/a2ui-project/a2ui/releases)                               |

### Swift

Swift 库通过 Swift Package Manager 从仓库根目录的 [Package.swift](https://github.com/a2ui-project/a2ui/blob/main/Package.swift) 分发。

| 包                                                                                                | 说明                                             |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| [A2UISwiftCore, BasicCatalog](https://github.com/a2ui-project/a2ui/tree/main/swift/core/)         | 消息处理器、数据模型、表达式求值与基础目录定义。 |
| [A2UISwiftUI, BasicCatalogSwiftUI](https://github.com/a2ui-project/a2ui/tree/main/swift/swiftui/) | SwiftUI 渲染器与基础目录视图。                   |

## 路线图

- **协议 v1.1**：我们正在收集 A2UI 协议下一版的需求。
- **推理**：支持决策模型（如 Jev）。
- **模板**：跨框架模板引擎与一组标准原语，用于渲染可复用的富 UI 组件。
- **沙箱化逻辑**：为 A2UI 组件安全附加逻辑的方式。
- **Agent SDK**：技能生成、更好的诊断信息，以及与更多智能体框架的集成。
- **评测（Evals）**：一套评估生成界面质量的工具。
- **MCP Apps**：在 A2UI 中嵌入 MCP Apps，以及把 A2UI 体验嵌入 MCP Apps。
- **CLI**：Schema 校验、代码生成、本地预览，以及与编码智能体的集成。

## 贡献

A2UI 是采用 **Apache 2.0** 许可的项目。我们相信 UI 的未来属于智能体，期待与你一起构建。

如何开始，详见 [CONTRIBUTING.md](https://github.com/a2ui-project/a2ui/blob/main/CONTRIBUTING.md)。
