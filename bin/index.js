#!/usr/bin/env node
const shell = require('shelljs');
const commander = require('commander');
const inquirer = require('inquirer');
const ora = require('ora');
const fs = require('fs');
const path = require('path');
const spinner = ora();
const gitClone = require('git-clone')
const chalk = require('chalk')

commander
	.version('0.0.1', '-v, --version')
  // .option('-a, --aaa', 'aaaaa')
  // .option('-b, --bbb', 'bbbbb')
  // .option('-c, --ccc [name]', 'ccccc')
	.parse(process.argv);

// if (commander.version) {
//   console.log('0.0.1');
// }

const questions = [
  {
    type: 'input',
    name: 'name',
    message: '请输入项目名称',
    default: 'my-project',
    validate: (name) => {
      if(/^[a-z]+/.test(name)){
        return true;
      }else{
        return '项目名称必须以小写字母开头';
      }
    }
  },
  {
    type: 'list',
    message: '请选择一种模板:',
    name: 'template',
    choices: [
      'template-mpx',
      'template-lib',
      'template-ui'
    ],
    // 使用filter将回答变为小写
    filter: function (val) {
      return val.toLowerCase()
    }
  }
]

inquirer.prompt(questions).then((result)=>{
  console.log('result', result)
  downloadTemplate(result);
})

function downloadTemplate (result) {
  let dir = result.name
  let template = result.template
  //  判断目录是否已存在
  let isHasDir = fs.existsSync(path.resolve(dir));
  if(isHasDir){
    spinner.fail('当前目录已存在!');
    return false;
  }
  spinner.start(`您选择的目录是: ${chalk.red(dir)}, 数据加载中,请稍后...`);
  // 克隆 模板文件
  gitClone(`https://github.com/silencelog/${template}.git`, dir , null, function(err) {
    // 移除无用的文件
    shell.rm('-rf', `${dir}/.git`)
	  spinner.succeed('项目初始化成功!')
    // 运行常用命令
    shell.cd(dir)
	  spinner.start(`正在帮您安装依赖...`);
    shell.exec('npm i')
	  spinner.succeed('依赖安装成功!')
    // shell.exec('npm run dev')
  })
}
