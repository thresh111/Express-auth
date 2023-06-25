function handlerError(err, req, res, next) {
  let data = {
    code: 0,
    msg: err,
  };

  res.json(data);
}

module.exports = {
  handlerError,
};
