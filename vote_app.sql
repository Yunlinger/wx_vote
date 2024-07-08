/*
 Navicat Premium Data Transfer

 Source Server         : stuSys
 Source Server Type    : MySQL
 Source Server Version : 80031 (8.0.31)
 Source Host           : localhost:3306
 Source Schema         : vote_app

 Target Server Type    : MySQL
 Target Server Version : 80031 (8.0.31)
 File Encoding         : 65001

 Date: 28/06/2024 14:42:25
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for Admins
-- ----------------------------
DROP TABLE IF EXISTS `Admins`;
CREATE TABLE `Admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of Admins
-- ----------------------------
BEGIN;
INSERT INTO `Admins` (`id`, `username`, `password`) VALUES (1, 'admin', '123456');
COMMIT;

-- ----------------------------
-- Table structure for Users
-- ----------------------------
DROP TABLE IF EXISTS `Users`;
CREATE TABLE `Users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `openid` varchar(255) NOT NULL,
  `nickname` varchar(255) DEFAULT NULL,
  `avatarUrl` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of Users
-- ----------------------------
BEGIN;
INSERT INTO `Users` (`id`, `openid`, `nickname`, `avatarUrl`) VALUES (1, 'o5NjJ67j-sx7kgC0ekx3vpIDOM8k', '微信用户', 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132');
COMMIT;

-- ----------------------------
-- Table structure for VoteOptions
-- ----------------------------
DROP TABLE IF EXISTS `VoteOptions`;
CREATE TABLE `VoteOptions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `voteId` int DEFAULT NULL,
  `optionText` varchar(255) DEFAULT NULL,
  `votes` int DEFAULT '0',
  `op_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `voteId` (`voteId`),
  CONSTRAINT `voteoptions_ibfk_1` FOREIGN KEY (`voteId`) REFERENCES `Votes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=125 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of VoteOptions
-- ----------------------------
BEGIN;
INSERT INTO `VoteOptions` (`id`, `voteId`, `optionText`, `votes`, `op_id`) VALUES (116, 44, '吃', 0, 0);
INSERT INTO `VoteOptions` (`id`, `voteId`, `optionText`, `votes`, `op_id`) VALUES (117, 44, '不吃', 1, 1);
INSERT INTO `VoteOptions` (`id`, `voteId`, `optionText`, `votes`, `op_id`) VALUES (118, 44, '偶尔', 0, 2);
INSERT INTO `VoteOptions` (`id`, `voteId`, `optionText`, `votes`, `op_id`) VALUES (119, 45, '一年', 0, 0);
INSERT INTO `VoteOptions` (`id`, `voteId`, `optionText`, `votes`, `op_id`) VALUES (120, 45, '一年半', 0, 1);
INSERT INTO `VoteOptions` (`id`, `voteId`, `optionText`, `votes`, `op_id`) VALUES (121, 45, '一坤年', 0, 2);
COMMIT;

-- ----------------------------
-- Table structure for Votes
-- ----------------------------
DROP TABLE IF EXISTS `Votes`;
CREATE TABLE `Votes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of Votes
-- ----------------------------
BEGIN;
INSERT INTO `Votes` (`id`, `title`, `userId`) VALUES (44, '你早上吃饭吗？', 1);
INSERT INTO `Votes` (`id`, `title`, `userId`) VALUES (45, '哥哥练习多久？', 1);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
