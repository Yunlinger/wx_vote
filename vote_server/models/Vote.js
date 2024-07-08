// models/Vote.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vote = sequelize.define('Vote', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING
  },
  votes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

module.exports = Vote;
