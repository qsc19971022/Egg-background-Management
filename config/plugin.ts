/*
 * @Author: your name
 * @Date: 2020-08-31 13:12:34
 * @LastEditTime: 2020-11-26 14:08:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /background/config/plugin.ts
 */
import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  // static: true,
  // nunjucks: {
  //   enable: true,
  //   package: 'egg-view-nunjucks',
  // },
    sequelize: {
        enable: true,
        package: 'egg-sequelize-ts',
    },
    validate:{
        enable: true,
        package:'egg-validate'
    },
    sessionRedis:{
        enable: true,
        package: 'egg-session-redis',
    },
    redis:{
        enable: true,
        package: 'egg-redis',
    },
    cors: {
        enable: true,
        package: 'egg-cors',
    },
    
};

export default plugin;
