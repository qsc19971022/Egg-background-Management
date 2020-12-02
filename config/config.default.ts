/*
 * @Author: your name
 * @Date: 2020-08-31 13:12:34
 * @LastEditTime: 2020-11-26 13:33:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /background/config/config.default.ts
 */
import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1598850750315_9894';
  config.serverTimeout = 15000;
  // add your egg config in here
  config.middleware = ['auth'];
  config.auth = {
    baseUrls: ['/home','/getUser']
  };
  config.multipart = {
    mode: 'file',
    fileSize: '10mb',
    fileExtensions:['.xlsx']
  };
  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };
  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    username:'root',
    password: '10170551',
    database: 'student',
  };
  config.redis = {
    client: {
      host: '127.0.0.1',
      port: 6379,
      password: '',
      db: 0,
    },
    agent:true
  };
  // config.sequelize = {
  //   dialect: 'mysql',
  //   host: '47.94.107.136',
  //   port: 3306,
  //   username:'vuets',
  //   password: '10170551',
  //   database: 'vuets',
  // };
  // config.redis = {
  //   client: {
  //     host: '127.0.0.1',
  //     port: 6379,
  //     password: '',
  //     db: 0,
  //   },
  //   agent:true
  // };
  config.security = {
    csrf:{
      enable:false
    }
  };
  // config.session = {
  //   key: 'EGG_SESS',
  //   maxAge: 1000*3600*24,
  //   httpOnly: true,
  //   encrypt: true
  // };
  config.cors = {
    origin: 'http://127.0.0.1:8081',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    credentials:true  // 允许前端传递cookie
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
