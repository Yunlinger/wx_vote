// pages/createVote/createVote.js
Page({
  data: {
    title: '',
    options: ['', '']
  },
  inputTitle(e) {
    this.setData({
      title: e.detail.value
    });
  },
  inputOption(e) {
    const index = e.currentTarget.dataset.index;
    const value = e.detail.value;
    this.setData({
      [`options[${index}]`]: value
    });
  },
  addOption() {
    this.setData({
      options: [...this.data.options, '']
    });
  },
  removeOption(e) {
    const index = e.currentTarget.dataset.index;
    const options = this.data.options.filter((_, i) => i !== index);
    this.setData({
      options
    });
  },
  onShow(){
    const userId = wx.getStorageSync('userId');
    if (!userId) {
      wx.showModal({
        title: '提示',
        content: '请先登录后再创建投票',
        showCancel: false,
        success() {
          wx.switchTab({
            url: '/pages/me/me'
          });
        }
      })

    }
  },
  createVote() {
    const userId = wx.getStorageSync('userId');
    if (!userId) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }
    wx.request({
      url: 'http://localhost:3000/api/votes',
      method: 'POST',
      data: {
        title: this.data.title,
        options: this.data.options,
        userId
      },
      success: (res) => {
        wx.showToast({
          title: '创建成功',
          icon: 'success'
        });
        wx.navigateBack();
      }
    });
  }
});
