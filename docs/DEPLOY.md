# ClosetMate 部署上线指南

## 1. 推荐技术方案

- 前端：`Expo + React Native + TypeScript`
- 数据与图片：`Supabase`
- 天气：`Open-Meteo`
- 打包：`EAS Build`

这套方案的优点是上手门槛低、云打包方便、适合个人产品经理推进首版上线。

## 2. 本地准备

在 Mac 终端依次执行：

```bash
brew install node
node -v
npm -v
npm install -g eas-cli
```

## 3. 安装项目依赖

```bash
cd /Users/bytedance/Documents/cloth/closet-app
npm install
```

## 4. 启动本地预览

```bash
npm run start
```

然后在手机上安装 `Expo Go`，扫码即可预览。

## 5. 配置 Supabase

1. 打开 [Supabase](https://supabase.com/) 并创建项目。
2. 进入 SQL Editor，执行 `supabase/schema.sql`。
3. 在 Storage 中创建 bucket：`clothing-images`。
4. 将 `.env.example` 复制为 `.env`。
5. 在 `.env` 中填入：

```bash
EXPO_PUBLIC_SUPABASE_URL=你的项目URL
EXPO_PUBLIC_SUPABASE_ANON_KEY=你的匿名公钥
```

## 6. Android 打包

```bash
eas login
eas build:configure
eas build --platform android --profile production
```

完成后 EAS 会给你一个下载链接。

## 7. iOS 打包

1. 准备 Apple Developer 账号。
2. 将 `app.json` 里的 `ios.bundleIdentifier` 改成你自己的包名。
3. 执行：

```bash
eas build --platform ios --profile production
```

## 8. 上架建议

- Android：先通过内部测试包给 10-20 位种子用户试用，再提交 Google Play。
- iOS：先用 TestFlight 内测，再提交 App Store Review。

## 9. 你需要改的配置

- `app.json` 中的 `bundleIdentifier`
- `app.json` 中的 `android.package`
- `eas.json` 的打包 profile
- `.env` 中的 Supabase Key

## 10. 当前版本说明

当前交付的是可上线 MVP，已覆盖衣柜管理、穿搭推荐、自定义搭配、个人资料、天气建议等主流程。

后续若你要继续升级，我建议按下面顺序迭代：

1. 接入 Supabase 实时同步
2. 增加登录注册
3. 增加 AI 图像识别与吊牌识别
4. 增加穿搭社区和分享卡片
