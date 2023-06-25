let router = require("express").Router();

// 引入欢迎响应处理函数
let { handleIndexRes } = require("../controller/index");

// 默认路径配置
//
// router.use("/", handleIndexRes);

// 在路由表中引入user子路由
router.use("/user", require("./user"));

module.exports = router;
