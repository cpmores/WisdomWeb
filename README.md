# WisdomWeb

A basic Search Engine for personal use to maintain your own Knowledge Network.

+ 前端 `frontend` ：处理 `WebUI` 和数据传输
+ 后端 `backend` ：处理前端数据，并分派给 `search-engine` 和 `database`，接收返回数据后进行处理，发送给前端
+ 存储 `storage` ： `Web` 爬取，用户元信息和文件存储，用户隔离
+ 用户数据库 `database` ：存储用户 `hostname` 和 `password` （不使用明文）
+ 搜索 `search-engine` ：搜索组件，支持模糊搜索、关键词补全，承担所有文档访问工作
+ 其他组件 `utils` ：其他功能组件
+ `k8s` 部署 `deploy` ：部署配置文件
+ 自动化脚本 `scripts` ：部署使用

## 数据传输格式

### Register

1. `frontend` to `backend` 

```json
{
	"type": "register",
    "hostname": "yourname",
    "email": "youremail"
    "password": "yourpwd"
}
```

2. `backend` 2 `database(user)`

> parameterized query, avoiding SQLI

```sql
select id from db where hostname="yourname" and email="youremail";
```

if not found, send back to `frontend`

```json
{
    "type": "register",
    "result": true,
    "userid": db.id
}
```

found:

```json
{
    "type": "register",
    "result": false
}
```

### Login

1. `frontend` to `backend`

```json
{
    "type": "login",
    "hostname": "yourname",
    "password": "yourpasswd"
}
```
2. `backend` 2 `database(user)`

> parameterized query, avoiding SQLI

```sql
select id from db where hostname="yourname" and passwd=md5("yourpasswd");
```

if found, send back to `frontend` (wait until init finished)

```json
{
    "type": "login",
    "result": true,
    "userid": db.id
}
```

not found (immediately):

```json
{
    "type": "login",
    "result": false
}
```

### Init (After Login)

1. if  `login`  succeed, send to `search-engine`

```json
{
    "type": "init",
    "userid": id
}
```

2. `storage` send to `hot word list` and `search-engine`

```json
// to hot word list
{
    "type": "init",
    "userid": id,
    "trieNode": {
        "is_end": false,
        "children": {
            "a": {
                "is_end": true,
                "children": {
                    "b": {
                        "is_end": true,
                        "children": {}
                    }
                }
            },
            "b": {
                "is_end": false,
                "children": {
                    "c": {
                        "is_end": true,
                        "children": {}
                    }
                }
            }
        }
    },
    "history": ["first", "second", "third"...]
}
```

```json
// to search-engine
{
    "type": "init",
    "userid": id,
    "
}
```





