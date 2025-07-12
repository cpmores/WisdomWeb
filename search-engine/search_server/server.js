const express = require('express');
const { exec } = require('child_process');
const path = require('path');

const app = express();
    const port = 3001;

// 解析 JSON 请求体
app.use(express.json());

// 处理 JSON 数据并运行 search_engine 二进制文件
app.post('/search', (req, res) => {
  const { userid, search_string } = req.body;

  // 验证 JSON 数据
  if (!userid || !search_string) {
    return res.status(400).json({
      error: 'Missing required fields: userid and search_string are required'
    });
  }

  // 转义命令行参数，防止命令注入
  const escapeArg = (arg) => `"${arg.replace(/"/g, '\\"')}"`;

  // 构造 search_engine 命令
  const searchCommand = `${path.join('bin', 'search-engine')} ${escapeArg(userid)} ${escapeArg(search_string)}`;

  // 执行 search_engine 二进制文件
  exec(searchCommand, { maxBuffer: 1024 * 1024, timeout: 10000 }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing search_engine: ${stderr}`);
      return res.status(500).json({
        error: 'Error processing search_engine binary',
        details: stderr
      });
    }

    // 尝试解析 search_engine 输出为 JSON
    let searchResult = {};
    try {
      searchResult = JSON.parse(stdout);
    } catch (parseError) {
      console.error(`Error parsing search_engine output: ${parseError.message}`);
      return res.status(500).json({
        error: 'Failed to parse search_engine output as JSON',
        details: parseError.message,
        rawOutput: stdout
      });
    }

    // 返回结果
    res.json({
      message: 'Search completed successfully',
      searchOutput: searchResult,
      receivedData: { userid, search_string }
    });
  });
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
教务