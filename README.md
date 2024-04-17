## 教师教学科研管理系统

## 使用技术

- 后端 Go + Gin + gqlgen
- 后端管理界面 React + Redux + React-Router + Axios + TailwindCSS
- 前端 Angular + Angular Material 2 + apollo-angular
- 小程序(miniapp) taro + react + redux +apollo-client(apollo-upload-client) + Nutui
  - mini-program 由于 tailwindcss和ui库冲突弃用，转到css

## API

#### 1. Restful

```rest
// GET
/restful/accounts

// POST
/restful/account/create
/restful/admin/signin

// DELETE
/restful/account/delete/:id
```

#### 2. GraphQL

see in `/playground` or api test tool graphql mode (`/graphql`)

## 数据库

#### 1. MongoDB（用户数据存储）

#### 2. Redis（验证码服务）
