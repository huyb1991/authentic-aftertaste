// Constant
const { PAGE_NAME } = require('./constants');

const HomeController = (req, res, isAMP = false) => {
  const order = req.query.sort;
  return res.render(
    `client${isAMP ? '/amp' : ''}/home`,
    {
      isHomePage: true,
      pageName: PAGE_NAME.HOME
    },
  );
};


module.exports = {
  HomeController
};
