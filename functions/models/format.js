const { getTodayFormat } = require('../helpers');

const formatDocumentBase = (obj) => {
  const formatObj = JSON.parse(JSON.stringify(obj));
  delete formatObj['id'];

  // Update created and modified date
  formatObj.modified = getTodayFormat();

  if (!formatObj.created) {
    formatObj.created = getTodayFormat();
  }

  // VN format: DD-MM-YYY;
  // formatObj.updated = `${today}-${currentMonth}-${currentYear}`;

  return formatObj;
};

const formatDocumentBlog = (data) => {
  const formatObj = formatDocumentBase(data);
  const saveArr = [];
  const slugArr = formatObj.slug.split('-');

  slugArr.forEach((it, idx) => {
    if (idx !== 0) {
      saveArr.push(slugArr.slice(0, idx).join('-'))
    }
  });
  saveArr.push(formatObj.slug);

  formatObj.slugArr = saveArr;

  return formatObj;
};

module.exports = {
  formatDocumentBase,
  formatDocumentBlog
};
