import { Service } from 'egg';
import {Role} from "../model/roles";
const { Op } = require("sequelize");
export default class Users extends Service {
    public async getAll() {
        const result = await this.ctx.model.User.findAll();
        result.map(item => {
            delete item['dataValues'].password;
        });
        return result;
    }
    public async getUsers(data) {
        let {currentPage, pageSize,role, origin, type, key} = data;
        currentPage = parseInt(currentPage);
        pageSize = parseInt(pageSize);
        const defaultSearch = {
            [Op.or]:[
                {username:{[Op.substring]:key}},
                {phone:{[Op.substring]:key}},
                {email:{[Op.substring]:key}}
            ]
        };
        if (key || role || origin || type) {
            const condition:any[] = [];
            if (key) {
                condition.push(defaultSearch);
            }
            if (role) {

            }
            if (origin) {
                condition.push({github:true});
            }
            if (type) {
                condition.push({[type]:{[Op.substring]:key}});
            }
            const result = await this.ctx.model.User.findAll({
                include:[{model:Role}],
                limit:pageSize,
                offset:(currentPage - 1) * pageSize,
                where:condition
            });
            result.map(item => {
                delete item['dataValues'].password;
            });
            const count = await this.ctx.model.User.findAndCountAll({where:condition});
            return {users:result,count:count.count};
        } else {
            const result = await this.ctx.model.User.findAll({
                attributes:{
                    exclude:['password', 'created_at', 'updated_at']
                },
                include:[{model:Role}],
                limit:pageSize,
                offset:(currentPage - 1) * pageSize,
            });
            const totalCount = await this.ctx.model.User.findAndCountAll();
            return {users:result, count:totalCount.count};
        }
    }
    public async createUser(data) {
        let {username,email,phone,password} = data;
        data.password = this.ctx.helper.encryptText(password);
        let user;
        if (username) {
            user = await this.ctx.model.User.findOne({where:{username}});
            if (user) {
                throw new Error("用户名已存在");
            }
        } else {
            delete data.username;
        }
        if (email) {
            user = await this.ctx.model.User.findOne({where:{email}});
            if (user) {
                throw new Error('邮箱已存在');
            }
        } else {
            delete data.email;
        }
        if (phone) {
            user = await this.ctx.model.User.findOne({where:{phone}});
            if (user) {
                throw new Error('手机号码已存在');
            }
        } else {
            delete data.phone;
        }
        const result = await this.ctx.model.User.create(data);
        const userData = result['dataValues'];
        delete userData.password;
        return userData;
    }
    public async delete(id) {
        const user = await this.ctx.model.User.findOne({where:id});
        if (user) {
            try{
                if (user.dataValues.github) {
                    await this.ctx.model.Oauth.destroy({where:{user_id:id.id}})
                }
                const data = await this.ctx.model.User.destroy({where:id});
                if (data > 0) {
                    return user;
                }else {
                    throw new Error('删除用户失败');
                }
            }catch (e) {
                return this.ctx.error(500,e.message)
            }
        } else {
            throw new Error("该用户不存在");
        }
    }
    public async edit(data){
        const id = data.id;
        delete data.id;
        const res = await this.ctx.model.User.findOne({where:{id}});
        if (res) {
            let flag = await this.ctx.model.User.findOne({where:{username:data.username}});
            if (flag && flag['dataValues'].id != id) {
                throw new Error('用户名已存在');
            }
            if (data.email) {
                flag = await this.ctx.model.User.findOne({where:{email:data.email}});
                if (flag && flag['dataValues'].id != id) {
                    throw new Error('邮箱已存在');
                }
            }
            if (data.phone) {
                flag = await this.ctx.model.User.findOne({where:{phone:data.phone}});
                if (flag && flag['dataValues'].id != id) {
                    throw new Error('手机号码已存在');
                }
            }
            const user = await this.ctx.model.User.update(data,{where:{id}});
            return user;
        } else {
            throw new Error("该用户不存在")
        }
    }
}
