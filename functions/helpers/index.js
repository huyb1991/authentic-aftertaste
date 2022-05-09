// Define constants
const today = new Date().getDate();
const currentMonth = new Date().getMonth() + 1;
const currentYear = new Date().getFullYear();

// Format Date to format: YYYY-MM-DD
const getTodayFormat = () => {
  return new Date().toISOString().slice(0, 10);
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

const getRandomNumber = (min = 1, max = 10) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Rating array https://stackoverflow.com/a/64807037/5456204
const getRatingValue = (ratings = [0, 0, 0, 0, 0]) => {
  let totalValue = 0;
  let totalCount = 0;

  ratings.forEach((count, idx) => {
    totalCount += Number(count);
    totalValue += Number(count) * Number(idx + 1);
  });

  const ratingAVG = Number((totalValue / totalCount)).toFixed(2);

  return {
    avg: ratingAVG,
    count: totalCount,
  };
};

const render404Page = (res) => {
  return res.render(
    'client/404',
    {
      title: 'Page Not Found - Authentic Aftertaste',
      metaPageTitle: 'Page Not Found - Authentic Aftertaste',
      metaPageDesc: 'Page Not Found - Authentic Aftertaste',
    },
  );
};

module.exports = {
  today,
  currentMonth,
  currentYear,
  getTodayFormat,
  getFlashMessage,
  getRandomNumber,
  getRatingValue,
  convertToSlug,
  render404Page,
};
