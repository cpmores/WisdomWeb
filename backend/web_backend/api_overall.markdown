# Web Search API 大纲

基地址: `http://localhost:8080/api`  
认证: 除注册和登录外，需`Authorization: Bearer <token>`  
Swagger UI: `/swagger-ui/index.html`  
API文档: `/api-docs`

## 认证相关接口

1. **用户注册**
    - **URL**: `/api/users/register`
    - **方法**: `POST`
    - **用途**: 注册新用户
    - **参数**: `username`, `password`, `email`, `avatar` (可选), `signature` (可选)
    - **响应**: 用户详情

2. **用户登录**
    - **URL**: `/api/users/login`
    - **方法**: `POST`
    - **用途**: 用户登录，返回JWT和书签
    - **参数**: `email`, `password`
    - **响应**: `token`, 用户详情, 书签列表

3. **用户登出**
    - **URL**: `/api/users/logout`
    - **方法**: `POST`
    - **用途**: 使会话失效，标记用户离线
    - **参数**: 无
    - **响应**: 登出成功消息

4. **检查在线状态**
    - **URL**: `/api/users/useOnlineStatus`
    - **方法**: `GET`
    - **用途**: 获取用户在线状态
    - **参数**: 无
    - **响应**: `true`/`false`

5. **更新密码**
    - **URL**: `/api/users/updatePassword`
    - **方法**: `PUT`
    - **用途**: 更新用户密码
    - **参数**: `oldPassword`, `newPassword`
    - **响应**: 更新成功消息

6. **更新头像**
    - **URL**: `/api/users/updateAvatar`
    - **方法**: `PUT`
    - **用途**: 更新用户头像
    - **参数**: `base64Avatar` (可选), `file` (可选)
    - **响应**: 更新成功消息

7. **更新用户信息**
    - **URL**: `/api/users/updateUserInformation`
    - **方法**: `PUT`
    - **用途**: 更新用户名、签名或头像
    - **参数**: `username` (可选), `signature` (可选), `base64Avatar` (可选), `file` (可选)
    - **响应**: 更新成功消息

8. **更新签名**
    - **URL**: `/api/users/updateSignature`
    - **方法**: `PUT`
    - **用途**: 更新用户签名
    - **参数**: `signature`
    - **响应**: 更新成功消息

9. **更新用户名**
    - **URL**: `/api/users/updateUsername`
    - **方法**: `PUT`
    - **用途**: 更新用户名
    - **参数**: `newUsername`
    - **响应**: 更新成功消息

## 书签管理接口

10. **添加/更新书签**
    - **URL**: `/api/bookmarks/add`
    - **方法**: `POST`
    - **用途**: 添加或更新书签，同步爬虫服务
    - **参数**: `url`, `tag` (可选)
    - **响应**: 本地和爬虫操作结果

11. **删除书签**
    - **URL**: `/api/bookmarks/remove`
    - **方法**: `DELETE`
    - **用途**: 删除书签，同步爬虫服务
    - **参数**: `url`
    - **响应**: 本地和爬虫操作结果

12. **获取所有书签**
    - **URL**: `/api/bookmarks/listAll`
    - **方法**: `GET`
    - **用途**: 获取所有书签，按标签分组
    - **参数**: `sortBy` (可选, `time`/`click_count`)
    - **响应**: 分组书签列表

13. **按标签获取书签**
    - **URL**: `/api/bookmarks/listAllByTag`
    - **方法**: `GET`
    - **用途**: 获取指定标签的书签
    - **参数**: `tag`
    - **响应**: 书签列表

14. **获取分组书签**
    - **URL**: `/api/bookmarks/listGrouped`
    - **方法**: `GET`
    - **用途**: 按标签或月份分组获取书签
    - **参数**: `groupBy` (`tag`/`month`)
    - **响应**: 分组书签对象

15. **搜索书签**
    - **URL**: `/api/bookmarks/listMultSearch`
    - **方法**: `GET`
    - **用途**: 按标签和关键词搜索书签
    - **参数**: `tag` (可选), `keyword` (可选), `sortBy` (可选)
    - **响应**: 书签列表

16. **记录书签点击**
    - **URL**: `/api/bookmarks/click`
    - **方法**: `POST`
    - **用途**: 记录书签点击次数
    - **参数**: `url`
    - **响应**: 点击记录成功消息

## 搜索管理接口

17. **执行搜索**
    - **URL**: `/api/search`
    - **方法**: `GET`
    - **用途**: 执行搜索，记录历史
    - **参数**: `query`, `engine` (可选)
    - **响应**: 搜索结果和元数据

18. **获取搜索历史**
    - **URL**: `/api/search/history`
    - **方法**: `GET`
    - **用途**: 获取搜索历史
    - **参数**: `sortBy` (可选, `time`/`count`)
    - **响应**: 搜索历史列表

## 注意事项
- **认证**: 除注册和登录外，所有接口需有效JWT令牌。
- **错误**: 400 (客户端错误), 500 (服务器错误)。
- **时间格式**: ISO 8601 (如`2025-07-12T09:39:00+08:00`)。
- **文件上传**: 头像支持JPEG/PNG/GIF，最大5MB。