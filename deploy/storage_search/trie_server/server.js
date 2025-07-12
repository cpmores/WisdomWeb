const express = require('express');
const { exec } = require('child_process');
const path = require('path');

const app = express();
    const port = 3002;

// 解析 JSON 请求体
app.use(express.json());

// 处理 JSON 数据并运行 search_engine 二进制文件
app.post('/trie-json', (req, res) => {
  const { userid } = req.body;

  // 验证 JSON 数据
  if (!userid) {
    return res.status(400).json({
      error: 'Missing required fields: userid is required'
    });
  }

  // 转义命令行参数，防止命令注入
  const escapeArg = (arg) => `"${arg.replace(/"/g, '\\"')}"`;

  const searchCommand = `${path.join('bin', 'trie_get')} ${escapeArg(userid)}`;

  // 执行 search_engine 二进制文件
  exec(searchCommand, { maxBuffer: 1024 * 1024, timeout: 10000 }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing trie sending: ${stderr}`);
      return res.status(500).json({
        error: 'Error processing trie_get binary',
        details: stderr
      });
    }

    // 尝试解析 search_engine 输出为 JSON
    let searchResult = {};
    try {
      searchResult = JSON.parse(stdout);
    } catch (parseError) {
      console.error(`Error parsing trie_get output: ${parseError.message}`);
      return res.status(500).json({
        error: 'Failed to parse trie_get output as JSON',
        details: parseError.message,
        rawOutput: stdout
      });
    }

    // 返回结果
    res.json({
      message: 'Trie Get completed successfully',
      trieOutput: searchResult,
      receivedData: { userid }
    });
  });
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});