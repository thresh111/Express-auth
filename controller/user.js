// 注册响应处理函数
function handlerRegisterRes(req, res) {
  let data = {
    code: 1,
    msg: "恭喜注册成功！",
  };
  res.json(data);
}

// 登录响应处理函数
function handlerLoginRes(req, res) {
  let data = {
    code: 1,
    info: req.info,
    msg: "恭喜登录成功！",
    token: req.token,
  };
  res.json(data);
}

// 用户详情响应处理函数
function handlerInfoRes(req, res) {
  let data = {
    code: 1,
    info: req.info,
    msg: "获取用户信息成功！",
  };
  res.json(data);
}

// 修改个人资料响应处理函数
function handlerUpdateRes(req, res) {
  let data = {
    code: 1,
    info: req.info,
    msg: "修改个人资料成功！",
  };
  res.json(data);
}

// 修改个人资料响应处理函数
function handlerRpwdRes(req, res) {
  let data = {
    code: 1,
    info: req.info,
    msg: "密码修改成功！",
  };
  res.json(data);
}
module.exports = {
  handlerRegisterRes,
  handlerLoginRes,
  handlerInfoRes,
  handlerUpdateRes,
  handlerRpwdRes,
};
