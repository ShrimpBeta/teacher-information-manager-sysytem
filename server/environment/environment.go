package environment

import "time"

const ServeURL = "http://localhost:8080"
const DefaultPort = "8080"
const DefaultMongodbUrl = "mongodb://localhost:27017"
const DatabaseName = "TeacherInfoMS"
const RedisAddress = "localhost:6379"
const AllowOrigins = "*"

// Graphql API
const GraphQL = "/graphql"
const Playground = "/playground"

// RESTFUL API
const Restful = "/restful"

const AdminAccount = "admin"
const AdminPassword = "admin"

// expire time

// 24小时有效
const UserTokenExpireTime = time.Hour * 24

// 5小时有效
const AdminTokenExpireDuration = time.Hour * 4

const CodeExpireTime = 3600
