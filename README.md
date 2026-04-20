# ClosetMate

一款面向“衣橱管理 + 穿搭建议”场景的 Expo React Native 手机应用。

## 已实现能力

- 衣物新增、编辑、删除
- 拍照/相册选择衣物图片
- 衣柜搜索、分类筛选、常用标记
- 基于天气、场景、风格偏好的穿搭推荐
- 自定义搭配与保存穿搭
- 个人资料与城市偏好设置
- 本地持久化存储
- 可选接入 Supabase 图片存储

## 快速开始

```bash
cd closet-app
npm install
npm run start
```

然后使用 Expo Go 扫码预览。

## 可选云端能力

1. 在 Supabase 创建项目。
2. 执行 `supabase/schema.sql`。
3. 创建公开 bucket：`clothing-images`。
4. 把 `.env.example` 复制成 `.env`，填入 `EXPO_PUBLIC_SUPABASE_URL` 和 `EXPO_PUBLIC_SUPABASE_ANON_KEY`。

## 打包上线

```bash
npm install -g eas-cli
eas login
eas build --platform android --profile production
eas build --platform ios --profile production
```

详细说明见 `docs/DEPLOY.md`。
