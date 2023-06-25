const mongoose = require("mongoose");
let { Schema } = mongoose;

// 连接数据库 : 数据库名
mongoose.connect("mongodb://localhost/user");

// 设置规定
let users_schema = new Schema({
  username: {
    type: String,
    // 唯一性设置
    unique: true,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  nickname: {
    type: String,
  },
  gender: {
    type: String,
  },
  age: Number,
  // 我们可以设置用户的默认头像
  acatar: {
    type: String,
    default: "http://localhost:3000/images/3.jpg",
  },
});

// 根据模式创建操作模型

let users_model = mongoose.model("users", users_schema);

module.exports = users_model;
