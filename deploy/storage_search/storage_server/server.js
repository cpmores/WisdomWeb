const express = require('express');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const port = 3000;

// 解析JSON请求体
app.use(express.json());

// 处理JSON数据并依次运行Julia脚本和C++二进制文件
app.post('/receive-json', (req, res) => {
  const { url, tag, userid, operation } = req.body;

  // 验证JSON数据
  if (!url || !tag || !userid || !operation) {
    return res.status(400).json({ error: 'Missing required fields: url, tag, userid, and operation are required' });
  }

  // 验证operation参数
  if (operation !== 'append' && operation !== 'remove') {
    return res.status(400).json({ error: 'Invalid operation: must be "append" or "remove"' });
  }

  // 验证URL格式
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };
  if (!isValidUrl(url)) {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  // 转义命令行参数，防止命令注入
  const escapeArg = (arg) => `"${arg.replace(/"/g, '\\"')}"`;

  // 第一步：运行Julia爬虫脚本（仅在append时执行）
  const processJulia = (callback) => {
    if (operation === 'remove') {
      return callback('Skipped Julia script for remove operation');
    }
    const juliaCommand = `julia ${path.join('bin', 'MyCrawler.jl')} ${escapeArg(url)} ${escapeArg(tag)} ${escapeArg(userid)}`;
    exec(juliaCommand, { maxBuffer: 1024 * 1024, timeout: 30000 }, (juliaError, juliaStdout, juliaStderr) => {
      if (juliaError) {
        console.error(`Error executing Julia script: ${juliaStderr}`);
        return res.status(500).json({ error: 'Error processing Julia script', details: juliaStderr });
      }
      callback(juliaStdout);
    });
  };

  processJulia((juliaOutput) => {
    // 第二步：运行trie二进制文件
    const trieCommand = `${path.join('bin', 'trie_index')} ${escapeArg(url)} ${escapeArg(userid)}`;
    exec(trieCommand, { maxBuffer: 1024 * 1024, timeout: 10000 }, (trieError, trieStdout, trieStderr) => {
      if (trieError) {
        console.error(`Error executing trie binary: ${trieStderr}`);
        return res.status(500).json({ error: 'Error processing trie binary', details: trieStderr });
      }

      // 第三步：运行index_manager二进制文件
      const indexCommand = `${path.join('bin', 'inverted_index')} ${escapeArg(url)} ${escapeArg(userid)} ${escapeArg(operation)}`;
      exec(indexCommand, { maxBuffer: 1024 * 1024, timeout: 10000 }, (indexError, indexStdout, indexStderr) => {
        if (indexError) {
          console.error(`Error executing index_manager binary: ${indexStderr}`);
          return res.status(500).json({ error: 'Error processing index_manager binary', details: indexStderr });
        }

        // 返回所有步骤的结果
        res.json({
          message: 'Processing completed successfully',
          juliaOutput,
          trieOutput: trieStdout,
          indexOutput: indexStdout,
          receivedData: { url, tag, userid, operation }
        });
      });
    });
  });
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});