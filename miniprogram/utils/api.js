const apiBase = 'http://localhost:3000/api'; // 替换为你的后端地址

const request = (url, method, data = {}) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${apiBase}${url}`,
      method,
      data,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          resolve(res.data);
        } else {
          reject(res.data);
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};

const getVotes = (query = '') => {
  const url = query ? `/votes?q=${encodeURIComponent(query)}` : '/votes';
  return request(url, 'GET');
};

const createVote = (data) => request('/votes', 'POST', data);
const vote = (data) => request('/votes/vote', 'POST', data);

module.exports = {
  getVotes,
  createVote,
  vote
};
