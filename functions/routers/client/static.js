// Helper
const CONTENT = require('../../content/_helper').readContent;

// STATIC PAGES
const ContactPage = (req, res) => {
  return res.render(
    'client/static-page/contact',
    {
      title: 'Liên hệ với chúng tôi',
      metaPageTitle: 'Liên hệ với chúng tôi',
      metaPageDesc: 'Liên hệ với chúng tôi!',
    },
  );
};

const AboutUsPage = (req, res) => {
  return res.render(
    'client/static-page/about',
    {
      title: 'Về Chúng Tôi',
      metaPageTitle: 'Về Chúng Tôi',
      metaPageDesc: 'Về Chúng Tôi!',
    },
  );
};

const TermOfUsePage = (req, res) => {
  return res.render(
    'client/static-page/term',
    {
      title: 'Điều khoản sử dụng',
      metaPageTitle: 'Điều khoản sử dụng',
      metaPageDesc: 'Điều khoản sử dụng!',
    },
  );
};

const DisclaimerPage = (req, res) => {
  return CONTENT.readFileContent(CONTENT.FILE_NAME.BANK_LIST)
    .then(banks => {
      return res.render(
        'client/static-page/disclaimer',
        {
          title: 'Miễn Trừ Trách Nhiệm',
          banks,
          metaPageTitle: 'Miễn Trừ Trách Nhiệm',
          metaPageDesc: 'Miễn Trừ Trách Nhiệm!',
        },
      );
    });
};


module.exports = {
  // Static pages
  ContactPage,
  AboutUsPage,
  TermOfUsePage,
  DisclaimerPage,
};
