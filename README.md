## 教师教学科研管理系统

## 使用技术

- 后端 Go + Gin + gqlgen
- 后端管理界面 React + Redux + React-Router + Axios + TailwindCSS
- 前端 Angular + Angular Material 2 + apollo-angular
- 小程序(miniapp) taro + react + redux +apollo-client(apollo-upload-client) + Nutui
- 部署，使用nginx进行部署

## 数据库

#### 1. MongoDB（用户数据存储）

#### 2. Redis（验证码服务）

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

## 后端

### 环境变量

环境变量默认存在于`environment`中，进行配置的默认初始化。

## 部署

配置文件见 `./nginx.conf`


