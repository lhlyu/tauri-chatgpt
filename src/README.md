# 设计

## 应用状态 app

- app

| **字段**    | **类型**            | **默认**   | **备注**         |
|:----------|:------------------|:---------|:---------------|
| theme     | 'dark' or 'light' | 'light'  | 主题             |
| lang      | 'zh' or 'en'      | 'zh'     | 语言             |
| enter     | boolean           | true     | 是否启用enter发送    |
| markdown  | boolean           | true     | 是否启用markdown解析 |
| collapse  | boolean           | false    | 是否折叠左侧栏        |
| ai        | string            | 'openai' | 当前打开的ai类型      |

- openai


| **字段**  | **类型** | **默认** | **备注**     |
|---------|--------|--------|------------|
| name    | string |        | AI的名字      |
| avatar  | string |        | ai的头像      |
| ts      | number |        | 创建时间       |
| host    | string |        | 请求地址       |
| key     | string |        | openai key |
| code    | string |        | 授权码        |
| timeout | number |        | 超时时间       |

- 会话表 Session

| **字段**  | **类型** | **默认**       | **备注** |
|---------|--------|--------------|--------|
| id      | text   |              | 会话id   |
| ai      | text   |              | 所属ai   |
| name    | text   |              | 会话的名字  |
| avatar  | text   |              | 会话的头像  |
| desc    | text   |              | 一些描述   |
| ts      | int    |              | 创建时间   |
| option  | text   | {}           | 会话参数   |

- 消息表 Message

| **字段**     | **类型** | **默认** | **备注**     |
|------------|--------|--------|------------|
| id         | text   |        | 消息ID       |
| session_id | text   |        | 会话ID       |
| ts         | int    |        | 创建时间，毫秒时间戳 |
| role       | text   |        | 消息所属的角色    |
| content    | text   |        | 消息的内容      |