const {
  validateRegisterData,
  handlerRegisterDB,
  handlerLoginDB,
  handlerLoginToken,
  validateLoginData,
  validateInfoData,
  verifyToken,
  handlerInfoDB,
  validateUpdateData,
  handlerUpdateDB,
  validateRpwdData,
  handlerRpwdDB,
} = require("../middleware/user");
const {
  handlerRegisterRes,
  handlerLoginRes,
  handlerInfoRes,
  handlerUpdateRes,
  handlerRpwdRes,
} = require("../controller/user");
let router = require("express").Router();

// 1.注册接口
// 2.参数验证 , 正确 进行数据库写入
//           错误 返回错误响应

// 3.数据库操作
// 写入成功我们进入到数据响应处理函数
// 写入失败我们返回错误响应

// 4.相应处理函数 ： 提示注册状态

// 注册
router.post(
  "/register",
  validateRegisterData,
  handlerRegisterDB,
  handlerRegisterRes
);
// 登录
router.post(
  "/login",
  validateLoginData,
  handlerLoginDB,
  handlerLoginToken,
  handlerLoginRes
);

// 用户详情
// 获取用户详情功能请求传递的参数是否正确
// 验证token
// 根据token信息进行数据查询
// 返回响应数据
router.get(
  "/info",
  validateInfoData,
  verifyToken,
  handlerInfoDB,
  handlerInfoRes
);

// 修改个人资料
router.post(
  "/update",
  validateUpdateData,
  verifyToken,
  handlerUpdateDB,
  handlerUpdateRes
);

// 修改密码;
router.post(
  "/rpwd",
  validateRpwdData,
  verifyToken,
  handlerRpwdDB,
  handlerRpwdRes
);

module.exports = router;
