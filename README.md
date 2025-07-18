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

hosts 修改

```bash
44.218.106.137 wisdomweb.local
```

Turtorial

https://www.bilibili.com/video/BV1EFgAzjEk6/?spm_id_from=333.337.search-card.all.click&vd_source=c135d0dd82ccc9aed199a2e246e7ecc3
