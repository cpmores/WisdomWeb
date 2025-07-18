// server.js
const express = require('express');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());

app.post('/receive-json', (req, res) => {
  const { url, tag, userid, operation } = req.body;

  if (!url || !tag || !userid || !operation) {
    return res.status(400).json({ error: 'Missing required fields: url, tag, userid, and operation are required' });
  }

  if (operation !== 'append' && operation !== 'remove') {
    return res.status(400).json({ error: 'Invalid operation: must be "append" or "remove"' });
  }

  const isValidUrl = (u) => {
    try {
      new URL(u);
      return true;
    } catch {
      return false;
    }
  };
  if (!isValidUrl(url)) {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  const escapeArg = (arg) => `"${arg.replace(/"/g, '\\"')}"`;

  /* ===== 1. Python 爬虫（仅 append 时执行） ===== */
  const processCrawler = (callback) => {
    if (operation === 'remove') {
      return callback('Skipped crawler script for remove operation');
    }
    // 注意路径改为 crawler.py（即前面转换好的 Python 脚本）
    const pyCmd = `python3 ${path.join('bin', 'crawler.py')} ${escapeArg(url)} ${escapeArg(tag)} ${escapeArg(userid)}`;
    exec(pyCmd, { maxBuffer: 1024 * 1024, timeout: 30000 }, (err, stdout, stderr) => {
      if (err) {
        console.error(`Error executing crawler.py: ${stderr}`);
        return res.status(500).json({ error: 'Error processing crawler.py', details: stderr });
      }
      callback(stdout);
    });
  };

  processCrawler((crawlerOut) => {
    /* ===== 2. trie 索引 ===== */
    const trieCmd = `${path.join('bin', 'trie_index')} ${escapeArg(url)} ${escapeArg(userid)}`;
    exec(trieCmd, { maxBuffer: 1024 * 1024, timeout: 10000 }, (err, stdout, stderr) => {
      if (err) {
        console.error(`Error executing trie binary: ${stderr}`);
        return res.status(500).json({ error: 'Error processing trie binary', details: stderr });
      }

      /* ===== 3. inverted_index ===== */
      const idxCmd = `${path.join('bin', 'inverted_index')} ${escapeArg(url)} ${escapeArg(userid)} ${escapeArg(operation)}`;
      exec(idxCmd, { maxBuffer: 1024 * 1024, timeout: 10000 }, (err, stdout, stderr) => {
        if (err) {
          console.error(`Error executing index_manager binary: ${stderr}`);
          return res.status(500).json({ error: 'Error processing index_manager binary', details: stderr });
        }

        res.json({
          message: 'Processing completed successfully',
          crawlerOutput: crawlerOut,
          trieOutput: stdout,      // 第二步输出
          indexOutput: stdout,     // 第三步输出
          receivedData: { url, tag, userid, operation }
        });
      });
    });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});