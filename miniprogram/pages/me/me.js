Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    userVotes: []
  },
  deleteVote(e) {
    const voteId = e.currentTarget.dataset.voteid;
    wx.request({
      url: `http://localhost:3000/api/admin/votes/${voteId}`,
      method: 'DELETE',
      success: (res) => {
        if (res.data.success) {
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });
          const userId = wx.getStorageSync('userId');
          this.getUserVotes(userId);
        } else {
          wx.showToast({
            title: '删除失败',
            icon: 'none'
          });
        }
      }
    });
  },
  getUserProfile() {
    wx.getUserProfile({
      desc: '展示用户信息',
      success: (res) => {
        console.log(res);
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
        wx.login({
          success: (loginRes) => {
            if (loginRes.code) {
              wx.request({
                url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx03e6f029fa8c6cfb&secret=fb840b6efbbe339114c83de046eb9b12&js_code=' + loginRes.code + '&grant_type=authorization_code',
                method: 'GET',
                success: (sessionRes) => {
                  const openid = sessionRes.data.openid;
                  wx.request({
                    url: 'http://localhost:3000/api/login',
                    method: 'POST',
                    data: {
                      openid: openid,
                      nickName: res.userInfo.nickName,
                      avatarUrl: res.userInfo.avatarUrl
                    },
                    success: (loginApiRes) => {
                      wx.setStorageSync('userId', loginApiRes.data.id);
                      this.getUserVotes(loginApiRes.data.id);
                    }
                  });
                }
              });
            }
          }
        });
      }
    });
  },
  getUserVotes(userId) {
    wx.request({
      url: `http://localhost:3000/api/user/${userId}/votes`,
      method: 'GET',
      success: (res) => {
        this.setData({
          userVotes: res.data
        });
      }
    });
  },
  onShow() {
    const userId = wx.getStorageSync('userId');
    if (userId) {
      this.getUserVotes(userId);
    } else {
      this.setData({
        hasUserInfo: false
      });
    }
  },
  
  clearUserIdStorage() {
    wx.removeStorageSync('userId');
  }
});
