/**
 * @file 自动生成Icon组件的webpack插件
 * @author tangyida <530063113@qq.com>
 */
const path = require('path');
const fs = require('fs');
const babel = require('@babel/core');
const prettier = require('prettier');
const generator = require('@babel/generator').default;
const compiler = require('vue-template-compiler');
const { types: t } = require('@babel/core');

const { transformSync, traverse } = babel;

const resolve = currentPath => {
  return path.resolve(__dirname, '../', currentPath);
};

// icon组件 默认模板地址
const ICON_TEMP_INPUT = resolve('./components/template/IconTemp.vue');
// icon组件 默认输出地址
const ICON_TEMP_OUTPUT = resolve('./components/template/IconTest.vue');

const transformOptions = {
  ast: true,
  babelrc: false,
  configFile: false,
};
// import 语句缓存
const importStatementCache = [];
// icon名字缓存，用于去重
const iconNameCache = [];
// 转译的.vue的script代码
let vueParseCodeCache = null;
// ICON_MAP的语句映射
let iconMapStatment = null;

// 异步读取文件夹列表
const readDirAsync = async iconPath => {
  return new Promise((resolve, reject) => {
    fs.readdir(
      iconPath,
      {
        withFileTypes: true,
      },
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      },
    );
  });
};

// 异步读取文件
const readFileAsync = async filePath => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result.toString());
    });
  });
};

/**
 * 遍历文件夹下所有icon图片列表
 * @param {icon存放地址} iconPath
 */
const readIconFiles = async (iconPath, nestFolder = null) => {
  let icons = [];
  const imageReg = /\.jpeg|\.png|\.jpg|\.svg/i;

  const fileList = await readDirAsync(iconPath);
  const fileTypes = fileList.filter(file => file.isFile() && imageReg.test(file.name));
  const dirTypes = fileList.filter(file => file.isDirectory());

  icons = fileTypes.map(item => {
    return {
      ...item,
      oppositePath: nestFolder ? `${nestFolder}/${item.name}` : item.name,
    };
  });

  for (let i = 0; i < dirTypes.length; i++) {
    const each = dirTypes[i];
    const nestFolderUrl = nestFolder ? `${nestFolder}${each.name}` : each.name;
    const nestFiles = await readIconFiles(`${iconPath}/${each.name}`, nestFolderUrl);
    icons = icons.concat(nestFiles);
  }

  return icons;
};

// 解析vue文件的代码=>ast
const formatTemplateToAST = async filePath => {
  const tempCode = await readFileAsync(filePath);
  const vueParseCode = compiler.parseComponent(tempCode);
  vueParseCodeCache = vueParseCode;
  const { script: scriptCode } = vueParseCode;
  return transformSync(scriptCode.content, transformOptions);
};

// 生成ast转译代码
const generatorAST2Template = ast => {
  // new SourceCode(content)
  return generator(ast);
};

// vue 文件模板
const createVueFileTemplate = (template, scriptCode, styleCode) => {
  return `<template> ${template} </template>\n<script>\n${scriptCode}\n</script>\n<style lang="scss">${styleCode}</style>`;
};

// 输出vue文件
const outputComponent = async (filePath, content) => {
  const prettierOptions = await prettier.resolveConfig();

  const vueContent = createVueFileTemplate(
    vueParseCodeCache.template.content,
    content,
    prettierOptions,
    vueParseCodeCache.styles[0].content,
  );
  fs.writeFile(filePath, vueContent, err => {
    if (err) {
      console.error(err);
    }
    importStatementCache.length = 0;
    iconNameCache.length = 0;
    vueParseCodeCache = null;
    iconMapStatment = null;
  });
};

/**
 * 生成import文件语句
 * @param {文件夹全称（包括后缀名）} fullName
 */
const getImportStatment = (fullName, oppositePath) => {
  const name = fullName.split('.')[0];
  if (iconNameCache.indexOf(name) === -1) {
    iconNameCache.push(name);
  } else {
    return null;
  }

  const suffixName = fullName.split('.')[1];
  if (!name || !suffixName) {
    throw new Error('[auto-icon-created] Error: expected suffixName');
  }
  return t.ImportDeclaration(
    [t.ImportDefaultSpecifier(t.identifier(name))],
    t.StringLiteral(`@/assets/icon/${oppositePath}`),
  );
};

/**
 * 根据所给的图标列表，生成对应的ICON图标映射字段
 * @param {图标文件列表} icons
 */
const createObjectProperty = icons => {
  let keys = icons.map(item => item.name.split('.')[0]);

  // 对象属性去重
  keys = [...new Set(keys)];

  const objectPropertyStatment = keys.map(key => {
    return t.objectProperty(t.identifier(key), t.identifier(key));
  });

  return t.variableDeclaration('const', [
    t.variableDeclarator(t.identifier('ICON_MAP'), t.objectExpression(objectPropertyStatment)),
  ]);
};

module.exports = class AutoIconCreated {
  constructor (props = {}) {
    this.init(props);
  }

  init (props) {
    const { template = ICON_TEMP_INPUT, output = ICON_TEMP_OUTPUT } = props;
    this.inputPath = template === '' ? ICON_TEMP_INPUT : resolve(template);
    this.outputPath = output === '' ? ICON_TEMP_OUTPUT : resolve(output);
  }

  apply (compiler) {
    compiler.hooks.watchRun.tap('AutoIconCreated', async () => {
      const iconPath = resolve('assets/icon');
      const iconList = await readIconFiles(iconPath);
      const { ast } = await formatTemplateToAST(this.inputPath);

      traverse(ast, {
        enter (path) {
          if (path.node.type === 'ImportDeclaration') {
            importStatementCache.push(path);
          }

          if (path.node.type === 'VariableDeclaration') {
            if (t.isIdentifier(path.node.declarations[0].id, { name: 'ICON_MAP' })) {
              iconMapStatment = path;
            }
          }
        },
      });
      const LastImportNode = importStatementCache.pop();
      iconMapStatment.replaceWith(createObjectProperty(iconList));

      for (let i in iconList) {
        const iconName = iconList[i].name;
        const oppositePath = iconList[i].oppositePath;
        const isExist = importStatementCache.some(specifier => {
          const nodeSplitValue = specifier.node.source.value.split('/');
          const suffixName = nodeSplitValue.pop();
          return suffixName === iconName;
        });

        if (!isExist) {
          const sourceCode = getImportStatment(iconName, oppositePath);
          if (sourceCode) {
            LastImportNode.insertAfter(sourceCode);
          }
        }
      }

      const temp = generatorAST2Template(ast);
      outputComponent(this.outputPath, temp.code);
    });
  }
};
