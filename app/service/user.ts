import { Service } from 'egg';
import {Role} from "../model/roles";
import {Rights} from "../model/rights";
export default class Test extends Service {
    public async createUser(data) {
        let {username,email,phone,password,github} = data;
        password = this.ctx.helper.encryptText(password);
        if (username && !github){
            return await this.createUserByUsername(username,password);
        } else if (username && github) {
            return await this.createUserByGithub(username,password,github);
        } else if (email) {
            return await this.createUserByEmail(email,password);
        } else if (phone) {
            return await this.createUserByPhone(phone,password);
        }
    }
    private async createUserByPhone(phone,password){
        const user = await this.findUser({phone});
        if (user.length > 0) {
            return this.ctx.error(400,"该用户名已存在");
        }
        const data = await this.ctx.model.User.create({phone,password});
        const userData =  data['dataValues'];
        delete userData.password;
        return userData;
    }
    private async createUserByUsername(username,password){
        const user = await this.findUser({username:username});
        if (user.length > 0) {
            throw new Error('当前用户已存在');
        }
        const data = await this.ctx.model.User.create({username:username,password:password});
        const userData =  data['dataValues'];
        delete userData.password;
        return userData;
    }
    private async createUserByGithub(username,password,github){
        const user = await this.findUser({username:username});
        if (user.length > 0) {
            throw new Error('当前用户已存在');
        }
        const data = await this.ctx.model.User.create({username:username,password:password,github:github});
        const userData =  data['dataValues'];
        delete userData.password;
        return userData;
    }
    private async createUserByEmail(email,password){
        const user = await this.findUser(email);
        if (user) {
            return this.ctx.error(400,"该用户名已存在");
        }
        const data = await this.ctx.model.User.create({email,password});
        const userData =  data['dataValues'];
        delete userData.password;
        return userData;
    }
    private async findUser(option){
        return await this.ctx.model.User.findAll({where:option});
    }
    public async getUser({username,email,phone,password}){
        password = this.ctx.helper.encryptText(password);
        let res;
        if (email) {
            res = await this.ctx.model.User.findOne({where:{email,password},include:[{model:Role,include:[{model:Rights}]}]});
        }else if (phone) {
            res = await this.ctx.model.User.findOne({where:{phone,password},include:[{model:Role,include:[{model:Rights}]}]});
        }else if (username) {
            res = await this.ctx.model.User.findOne({where:{username,password},include:[{model:Role,include:[{model:Rights}]}]});
        }
        try{
            const userData =  res.dataValues;
            delete userData.password;
            let allRights:any[] = [];
            userData.roles.map(role => {
                role.rights.map(right => {
                    allRights.push(right);
                })
            });
            const temp = {};
            allRights = allRights.reduce((arr,item) => {
                if (!temp[item.dataValues.id]) {
                    arr.push(item);
                    temp[item.dataValues.id] = true;
                }
                return arr;
            },[]);

            allRights = allRights.filter(outItem => {
                allRights.map(inItem => {
                    if (outItem.dataValues.id === inItem.dataValues.pid) {
                        outItem.dataValues.children ? '' : outItem.dataValues.children = [];
                        outItem.dataValues.children.push(inItem);
                    }
                });
                if (outItem.dataValues.level === 0) return true;
            });
            userData.allRights = allRights;
            return userData;
        }catch (e) {
            throw new Error("用户名或密码不正确");
        }
    }
}
