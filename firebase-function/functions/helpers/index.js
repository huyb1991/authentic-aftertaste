// Define constants
const today = new Date().getDate();
const currentMonth = new Date().getMonth() + 1;
const currentYear = new Date().getFullYear();

// Format Date to format: YYYY-MM-DD
const getTodayFormat = () => {
  return new Date().toISOString().slice(0, 10);
};

const getSEOTitle = (
  month = currentMonth,
  year = currentYear
) => {
  return `SEO Title tháng ${month} năm ${year}?`;
};

const getSEODesc = (
  month = currentMonth,
  year = currentYear
) => {
  return `SEO Description tháng ${month} năm ${year}`;
};

const getFlashMessage = ({
  error,
  success,
  message,
}) =>
  JSON.parse(JSON.stringify({
    error: Boolean(error),
    success: Boolean(success),
    message,
  }));

const convertToSlug = (text) =>
  text.toLowerCase()
    .normalize('NFD')
    // Vietnamese characters
    .replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a')
    .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e')
    .replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i')
    .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o')
    .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u')
    .replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y')
    .replace(/đ/gi, 'd')
    // Special symbol
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');

const render404Page = (res) => {
  return res.render(
    'client/404',
    {
      title: 'Không Tìm Thấy Trang',
      metaPageTitle: 'Không Tìm Thấy Trang',
      metaPageDesc: 'Không Tìm Thấy Trang',
    },
  );
};

module.exports = {
  today,
  currentMonth,
  currentYear,
  getTodayFormat,
  getSEOTitle,
  getSEODesc,
  getFlashMessage,
  convertToSlug,
  render404Page
};
