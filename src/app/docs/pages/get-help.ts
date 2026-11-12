import {Component} from '@angular/core';
import {DocsPageHeader} from '../../shared/docs-page-header';
import {RouterLink} from '@angular/router';
import {CodeBlock} from '../../shared/code-block';

@Component({
  selector: 'app-docs-get-help',
  imports: [DocsPageHeader, RouterLink, CodeBlock],
  template: `
    <app-docs-page-header eyebrow="生态" heading="获取帮助">
        两条官方通道：给编码智能体装上官方 skill 让它陪你 co-create;
        或在 GitHub 仓库提反馈。另有一份独立第三方咨询目录，项目不背书、不排名、不认证。
    </app-docs-page-header>

    <div class="doc-prose">
      <h2 id="skill">让编码智能体帮你</h2>
      <p>官方维护了一份 A2UI skill(仓库 <code>skills/a2ui/SKILL.md</code>),
      装进你的编码智能体后可以直接提问、一起写目录与集成代码：</p>
      <app-code lang="bash" label="安装官方 skill" [code]="skillCmd" />

      <h2 id="feedback">反馈与贡献</h2>
      <p>问题、建议与咨询目录提交都走
      <a href="https://github.com/a2ui-project/a2ui" target="_blank" rel="noopener">a2ui-project/a2ui</a>。
      协议或 SDK 的安全漏洞走私密报告渠道，不要开公开 issue，见<a routerLink="/docs/security">安全模型</a>。</p>

      <h2 id="consultancies">咨询目录</h2>
      <p>以下独立第三方提供 A2UI 咨询服务(按字母序，示例应用与栈来自官方 Get Help 页):</p>
      <table>
        <thead><tr><th scope="col">公司</th><th scope="col">领域</th><th scope="col">示例应用</th><th scope="col">栈</th></tr></thead>
        <tbody>
          <tr><td>CopilotKit</td><td>开发者工具</td><td>A2UI Playground(多目录生成式 UI)</td><td>React · Next.js · Express · AG-UI</td></tr>
          <tr><td>L+R</td><td>电商</td><td>Alder(双屏对话造型师)</td><td>Flutter · GenUI · Genkit Dart</td></tr>
          <tr><td>Moonwise</td><td>金融</td><td>Homeward(购房规划)</td><td>Flutter · GenUI · Gemini</td></tr>
          <tr><td>OakTree Apps</td><td>医疗</td><td>VitalLoop(体征追踪)</td><td>Flutter · A2A · Python ADK</td></tr>
          <tr><td>Solid Software</td><td>医疗</td><td>GenUI Clinic(医生工作台)</td><td>Flutter Web · Express · Dart Cloud Functions</td></tr>
          <tr><td>Somnio Software</td><td>金融</td><td>Investing Companion(组合助手)</td><td>Flutter · A2UI JSON · Python FastAPI</td></tr>
          <tr><td>Soverius AI</td><td>AI 工程</td><td>Express Browser Demo(本地 Gemma UI)</td><td>Angular · WebGPU · Express · CopilotKit</td></tr>
          <tr><td>Very Good Ventures</td><td>智能家居</td><td>Riviera Home(厨房墙显)</td><td>Flutter · WebSocket · Dart Frog · Gemini Live</td></tr>
        </tbody>
      </table>

      <h2 id="listing">加入目录</h2>
      <p>想被列出：以 OSI 认可的许可证发布一个可运行的开源 A2UI 参考应用,
      然后向官方仓库提 PR，附上仓库、组件目录与演示媒体。完整列表与链接见
      <a href="https://a2ui.org/get-help/" target="_blank" rel="noopener">官方 Get Help 页</a>;
      社区作品与渲染器见<a routerLink="/docs/ecosystem">社区项目</a>。</p>
    </div>
  `,
})
export class GetHelpPage {
  protected readonly skillCmd = `bunx skills add a2ui-project/a2ui`;
}