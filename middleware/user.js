// 验证注册数据中间件
function validateRegisterData(req, res, next) {
  // post携带的数据应该在body之中，所以我们把数据从body之中进行取出
  let { username, password, rpassword, nickname } = req.body;
  // 根据请求的数据进行逻辑处理

  // console.log(username, password, rpassword, nickname);

  // 1. 必须参数有不存在的情况
  // 2. password 和 rpassword 两个值不同

  if (!username || !password || !rpassword || !nickname) {
    next("抱歉,请检查发送参数都填写后再发送");
  } else if (rpassword !== password) {
    next("抱歉你两次输入的密码不一致，请重新输入!");
  } else {
    next();
  }
}

//注册 操作数据中间件
function handlerRegisterDB(req, res, next) {
  // 进行数据库插入操作
  let users_model = require("../db/user");
  let md5 = require("md5");
  let { username, password, rpassword, nickname } = req.body;
  // 加密password
  password = md5(password);
  let user = new users_model({
    username,
    password,
    nickname,
  });

  user
    .save()
    .then(() => {
      return next();
    })
    .catch(() => {
      return next("用户名重复,请重新输入用户名");
    });
}

// 验证登录中间件
function validateLoginData(req, res, next) {
  // post携带的数据应该在body之中，所以我们把数据从body之中进行取出
  let { username, password } = req.body;
  if (!username || !password) {
    next("抱歉,请完整填写账号密码！");
  } else {
    next();
  }
}

//登录 操作数据中间件
function handlerLoginDB(req, res, next) {
  // 进行数据库插入操作
  let users_model = require("../db/user");
  let { username, password } = req.body;
  let md5 = require("md5");
  password = md5(password);
  users_model
    .find(
      { username, password },
      "username  password nickname gender age avatar"
    )
    .then((data) => {
      // console.log(data);
      // 处理查询结果
      if (data.length >= 1) {
        req.info = data[0];
        next();
      } else {
        next("用户名和密码不符！");
      }
    })
    .catch((error) => {
      // 处理错误
      return next("数据库错误");
    });
}

// 添加token信息的中间件
function handlerLoginToken(req, res, next) {
  // token 中间件 实在登录信息查询之后的中间件，登录信息已将放在了req.info之中
  // 我们要加密的数据也就是这个info的数据了
  let jwt = require("jsonwebtoken");
  // sign("加密的数据")
  let { username, password } = req.info;

  let token = jwt.sign({ username, password }, "LoginToken", {
    expiresIn: 3600,
  });

  req.token = token;
  next();
}

// 验证获取用户信息中间件
function validateInfoData(req, res, next) {
  // info 获取是 get 请求
  // 需要通过 req.query 获取
  let { id } = req.query;
  // 根据用户的 token 信息
  let { authorization } = req.headers;

  if (!id || !authorization) {
    next("传递的参数不完整或者没有登录！请完整传递参数或者登录后在重新请求");
  } else {
    req.id = id;
    req.token = authorization;
    next();
  }
}
// 解密token
function verifyToken(req, res, next) {
  // 获取到 token 数据
  let jwt = require("jsonwebtoken");
  // 解密token
  jwt.verify(req.token, "LoginToken", (err, data) => {
    if (err) {
      next("您的登录状态不正确, 请重新登录后再使用该功能!");
    } else {
      // 把解密之后token数据放入到info之中;
      req.info = data;
      next();
    }
  });
}

// 用户详情 操作数据
function handlerInfoDB(req, res, next) {
  // 进行数据库插入操作

  let users_model = require("../db/user");

  let { username, password } = req.info;

  users_model
    .find(
      { username, password },
      "username  password nickname gender age avatar"
    )
    .then((data) => {
      // console.log(data);
      // 处理查询结果
      if (data.length >= 1) {
        req.info = data[0];
        next();
      } else {
        next("用户信息有误,查询失败");
      }
    })
    .catch(() => {
      // 处理错误
      return next("数据库错误");
    });
}

// 修改个人资料
function validateUpdateData(req, res, next) {
  // 获取 id 信息
  let { id } = req.body;
  //  获取 token 信息
  let { authorization } = req.headers;
  if (!id) {
    return next("没有携带id信息,请确认携带id信息");
  }
  if (!authorization) {
    return next("请登录后在修改用户数据！");
  }
  req.id = id;
  req.token = authorization;

  next();
}
// 修改个人资料
function handlerUpdateDB(req, res, next) {
  // 进行数据库插入操作

  let users_model = require("../db/user");
  console.log(req.info);
  let { username, password } = req.info;
  let { age, gender, nickname } = req.body;
  users_model
    .updateOne({ username, password }, { age, gender, nickname })
    .then((res) => console.log(res));
  next();
}

// 验证修改密码
function validateRpwdData(req, res, next) {
  let { id, oldPassword, newPassword, rNewPassword } = req.body;
  //  获取 token 信息
  let { authorization } = req.headers;
  if (!id || !oldPassword || !newPassword || !rNewPassword) {
    next("传递的参数不全,请确认后在发送请求");
  } else if (newPassword !== rNewPassword) {
    next("新密码两次输入不一致！");
  } else if (!authorization) {
    return next("请登录后在修改密码！");
  } else if (oldPassword === newPassword) {
    next("新密码不能和旧密码一致！");
  } else {
    req.token = authorization;
    next();
  }
}

function handlerRpwdDB(req, res, next) {
  // 根据现有数据进行更新
  let users_model = require("../db/user");

  let { username, password } = req.info;
  let { newPassword } = req.body;

  users_model
    .updateOne({ username, password }, { password: newPassword })
    .then((res) => console.log(res));
  next();
}

// 导出中间件 ：
module.exports = {
  validateRegisterData,
  handlerRegisterDB,
  validateLoginData,
  handlerLoginDB,
  validateInfoData,
  verifyToken,
  handlerLoginToken,
  handlerInfoDB,
  validateUpdateData,
  handlerUpdateDB,
  validateRpwdData,
  handlerRpwdDB,
};
