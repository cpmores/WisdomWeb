# 前缀树后端 API 文档

本文档描述了前缀树后端提供的 API 接口，用于支持用户搜索词语和登出功能。后端使用 Flask 框架，运行在 `http://<host>:5000` 上。所有 API 请求和响应均使用 JSON 格式。

## 1. 搜索 API

### 端点
`GET /search`

### 描述
根据用户 ID 和搜索前缀，返回匹配的词语列表。支持中文和英文前缀搜索，自动检测语言。如果用户数据不存在，后端会从前缀树服务器获取数据并缓存，直到用户登出。

### 请求参数
- **Method**: GET
- **URL Parameters**:
  - `userid` (string, 必填): 用户唯一标识符。
  - `prefix` (string, 必填): 要搜索的前缀（中文或英文）。

### 请求示例
- **中文搜索**:
  ```bash
  curl "http://<host>:5000/search?userid=cpmores&prefix=学"
  ```
- **英文搜索**:
  ```bash
  curl "http://<host>:5000/search?userid=cpmores&prefix=en"
  ```

### 响应格式
- **成功响应** (HTTP 200):
  - **中文搜索示例**:
    ```json
    {
      "results": ["学习", "学校", "学生"],
      "userid": "cpmores",
      "language": "chinese"
    }
    ```
  - **英文搜索示例**:
    ```json
    {
      "results": ["english", "enough", "enjoy"],
      "userid": "cpmores",
      "language": "english"
    }
    ```
  - 字段说明:
    - `results`: 匹配前缀的词语列表。
    - `userid`: 请求中的用户 ID。
    - `language`: 检测到的前缀语言（`chinese` 或 `english`）。

- **错误响应**:
  - **400 Bad Request** (缺少参数):
    ```json
    {
      "error": "Missing userid or prefix",
      "userid": null
    }
    ```
  - **404 Not Found** (无用户数据或语言前缀树):
    ```json
    {
      "error": "No chinese trie found for user",
      "userid": "cpmores"
    }
    ```
  - **500 Internal Server Error** (服务器获取数据失败):
    ```json
    {
      "error": "Failed to fetch trie data",
      "userid": "cpmores"
    }
    ```

### 注意事项
- 前缀搜索对英文大小写不敏感。

## 2. 登出 API

### 端点
`POST /logout`

### 描述
清除指定用户的缓存数据，实现无状态登出。

### 请求参数
- **Method**: POST
- **Form Parameters**:
  - `userid` (string, 必填): 用户唯一标识符。

### 请求示例
```bash
curl -X POST -d "userid=cpmores" http://<host>:5000/logout
```

### 响应格式
- **成功响应** (HTTP 200):
  ```json
  {
    "message": "User cpmores data cleared",
    "userid": "cpmores"
  }
  ```

- **错误响应**:
  - **400 Bad Request** (缺少用户 ID):
    ```json
    {
      "error": "Missing userid",
      "userid": null
    }
    ```
  - **404 Not Found** (用户数据不存在):
    ```json
    {
      "error": "No data found for user cpmores",
      "userid": "cpmores"
    }
    ```

### 注意事项
- 登出后，用户的前缀树数据将被清除，后续搜索需重新从前缀树服务器获取数据。

