const api = require('../../utils/api.js');

Page({
  data: {
    votes: [],
    searchQuery: '',
    filteredVotes: []
  },
  onLoad() {
    this.getVotes();
  },
  onShow() {
    this.getVotes();
  },
  getVotes(query = '') {
    api.getVotes(query).then(votes => {
      this.setData({ 
        votes,
        filteredVotes: votes // 初始显示所有投票
      });
    }).catch(err => {
      wx.showToast({
        title: '加载投票失败',
        icon: 'none'
      });
    });
  },
  vote(event) {
    console.log(event);
    const { voteid, optionid } = event.currentTarget.dataset;
    api.vote({ voteId: voteid, optionId: optionid }).then(() => {
      wx.showToast({
        title: '投票成功',
        icon: 'success'
      });
      this.getVotes();
    }).catch(err => {
      wx.showToast({
        title: '投票失败',
        icon: 'none'
      });
    });
  },
  onSearchInput(event) {
    this.setData({
      searchQuery: event.detail.value
    });
  },
  onSearch() {
    const searchQuery = this.data.searchQuery;
    this.getVotes(searchQuery);
  }
});
