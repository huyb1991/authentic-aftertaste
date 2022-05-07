const { readFile, writeFile, readdir, unlink } = require('fs').promises;
const ENTITY = require('../constants').ENTITY;

const currentDir = __dirname + '/';
const getBlogPostFileName = (category, slug) =>
  `${ENTITY.BLOG}/${category}/${slug}`;
const getRecipeFileName = (slug) =>
  `${ENTITY.RECIPE}/${slug}`;

const FILE_NAME = {
  BLOG_POST: getBlogPostFileName,
  RECIPE_LATEST: 'recipe-latest',
  RECIPE_DETAIL: getRecipeFileName,
};

/**
 * Content file is always JSON type
 */
const readFileContent = (fileName) => {
  const filePath = currentDir + fileName + '.json';

  return readFile(filePath, 'utf8')
    .then(data => JSON.parse(data))
    .catch(err => {
      console.log(`Read file content error: "${filePath}"; ${err.message}`);

      return undefined;
    });
};

const writeFileContent = (fileName, data) => {
  const filePath = currentDir + fileName + '.json';
  return writeFile(filePath, JSON.stringify(data), 'utf8')
    .catch(err => {
      console.log(`Write file content error: "${filePath}"; ${err.message}`);

      return;
    });
};

const removeFileContent = (fileName) => {
  const filePath = currentDir + fileName + '.json';
  return unlink(filePath)
    .catch(err => {
      console.log(`Remove file error: "${filePath}"; ${err.message}`);

      return;
    });
};

/**
 * Get list file name under folder
 * Remove ".json" at the and, and format "_" to "-"
 */
const getListFileInFolder = (entity = ENTITY.BANK) => {
  return readdir(`${currentDir}${entity}`)
    .then(fileNames => fileNames
      .filter(it => it.includes('.json'))
      .map(it => it.replace('.json', '').replace('_', '-'))
    );
};

module.exports.readContent = {
  FILE_NAME,
  getListFileInFolder,
  readFileContent,
  writeFileContent,
  removeFileContent,
};
