# LinguaWorld - 多语种学习平台

支持英语、日语、韩语等多语言的在线学习平台。

## 功能特性

- 📚 分级课程体系（初级/中级/高级）
- 📝 单词记忆学习
- 📖 语法练习
- 🎤 口语跟读训练
- 🎧 听力训练
- 📊 学习进度追踪
- 🏆 成就系统
- 💬 社区交流
- 👤 用户注册登录（支持手机验证码）

## 技术栈

- React 18 + TypeScript
- TailwindCSS
- Zustand (状态管理)
- Vite (构建工具)
- Capacitor (跨平台移动端)

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 构建APK

本项目使用 GitHub Actions 自动构建APK：

1. Fork 本仓库
2. 在 GitHub 仓库页面点击 Actions
3. 点击 "Build Android APK" 工作流
4. 点击 "Run workflow"
5. 构建完成后在 Artifacts 中下载 APK

## 许可证

MIT
