// app.js

const express = require('express');
const bodyParser = require('body-parser');
const db = require('./config/database');
const app = express();
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());

// 管理员登录
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM Admins WHERE username = ? AND password = ?', [username, password], (err, results) => {
    if (err) {
      res.status(500).send('服务器错误');
      return;
    }

    if (results.length > 0) {
      res.send({ success: true, adminId: results[0].id });
    } else {
      res.send({ success: false, message: '用户名或密码错误' });
    }
  });
});

// 获取所有用户信息
app.get('/api/admin/users', (req, res) => {
  db.query('SELECT * FROM Users', (err, results) => {
    if (err) {
      res.status(500).send('服务器错误');
      return;
    }
    res.send(results);
  });
});

// 保存用户信息
app.post('/api/login', (req, res) => {
  const { openid, nickName, avatarUrl } = req.body;

  db.query('SELECT * FROM Users WHERE openid = ?', [openid], (err, results) => {
    if (err) {
      res.status(500).send('服务器错误');
      return;
    }

    if (results.length > 0) {
      res.send(results[0]);
    } else {
      db.query('INSERT INTO Users (openid, nickname, avatarUrl) VALUES (?, ?, ?)', [openid, nickName, avatarUrl], (err, result) => {
        if (err) {
          res.status(500).send('服务器错误');
          return;
        }

        res.send({
          id: result.insertId,
          openid,
          nickName,
          avatarUrl
        });
      });
    }
  });
});

// 获取所有投票及其选项
app.get('/api/votes', (req, res) => {
  const searchQuery = req.query.q;

  db.query('SELECT * FROM Votes', (err, votes) => {
    if (err) {
      res.status(500).send('服务器错误');
      return;
    }

    let filteredVotes = votes;

    if (searchQuery) {
      filteredVotes = votes.filter(vote => vote.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    const votePromises = filteredVotes.map(vote => {
      return new Promise((resolve, reject) => {
        db.query('SELECT voteid, optionText, votes, op_id FROM VoteOptions WHERE voteId = ?', [vote.id], (err, options) => {
          if (err) {
            reject(err);
          } else {
            vote.options = options;
            resolve(vote);
          }
        });
      });
    });

    Promise.all(votePromises)
      .then(results => {
        res.send(results);
      })
      .catch(error => {
        res.status(500).send('服务器错误');
      });
  });
});


// 创建新投票
app.post('/api/votes', (req, res) => {
  const { title, options, userId } = req.body;
  
  // 插入新投票
  db.query('INSERT INTO Votes (title, userId) VALUES (?, ?)', [title, userId], (err, result) => {
    if (err) {
      console.error('Error inserting new vote:', err);
      res.status(500).send('服务器错误');
      return;
    }

    const voteId = result.insertId; // 获取新插入的投票的 ID
    
    // 手动为每个选项分配递增的 op_id
    const optionObjects = options.map((optionText, index) => ({
      op_id: index, // 手动分配递增的 op_id
      voteId,
      optionText,
      votes: 0
    }));

    // 使用 Promise.all 批量插入选项
    Promise.all(optionObjects.map(option => insertVoteOption(voteId, option)))
      .then(() => {
        // 返回创建的投票信息，包括选项
        const createdVote = {
          id: voteId,
          title,
          options: optionObjects.map(option => ({
            op_id: option.op_id,
            optionText: option.optionText,
            votes: option.votes
          }))
        };
        res.status(201).json(createdVote);
      })
      .catch(error => {
        console.error('Error inserting vote options:', error);
        res.status(500).send('服务器错误');
      });
  });
});

// 辅助函数：插入投票选项到数据库
function insertVoteOption(voteId, option) {
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO VoteOptions (voteId, op_id, optionText, votes) VALUES (?, ?, ?, ?)', [voteId, option.op_id, option.optionText, option.votes], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

// 给选项投票
app.post('/api/votes/vote', (req, res) => {
  const { voteId, optionId } = req.body;
  
  // 检查 voteId 和 optionId 是否存在并有效
  db.query('UPDATE VoteOptions SET votes = votes + 1 WHERE op_id = ? AND voteId = ?', [optionId, voteId], (err, result) => {
    if (err) {
      res.status(500).send('服务器错误');
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send('选项不存在');
      return;
    }
    db.query('SELECT * FROM VoteOptions WHERE op_id = ? AND voteId = ?', [optionId, voteId], (err, results) => {
      if (err) {
        res.status(500).send('服务器错误');
        return;
      }
      res.send(results[0]);
    });
  });
});

// 获取用户创建的投票
app.get('/api/user/:userId/votes', (req, res) => {
  const userId = req.params.userId;

  db.query('SELECT * FROM Votes WHERE userId = ?', [userId], (err, votes) => {
    if (err) {
      res.status(500).send('服务器错误');
      return;
    }

    const votePromises = votes.map(vote => {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM VoteOptions WHERE voteId = ?', [vote.id], (err, options) => {
          if (err) {
            reject(err);
          } else {
            vote.options = options;
            resolve(vote);
          }
        });
      });
    });

    Promise.all(votePromises)
      .then(results => {
        res.send(results);
      })
      .catch(error => {
        res.status(500).send('服务器错误');
      });
  });
});

// 删除投票
app.delete('/api/admin/votes/:voteId', (req, res) => {
  const voteId = req.params.voteId;

  db.query('DELETE FROM VoteOptions WHERE voteId = ?', [voteId], (err) => {
    if (err) {
      res.status(500).send('服务器错误');
      return;
    }

    db.query('DELETE FROM Votes WHERE id = ?', [voteId], (err) => {
      if (err) {
        res.status(500).send('服务器错误');
        return;
      }
      res.send({ success: true });
    });
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
