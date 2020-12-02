import { Service } from 'egg';
const { Op } = require("sequelize");
const {Rights} = require('../model/rights');
export default class Roles extends Service {
    public async getRoles(data) {
        let {currentPage, pageSize, key} = data;
        currentPage = parseInt(currentPage);
        pageSize = parseInt(pageSize);
        const defaultSearch = {
            [Op.or]:[
                {role_name:{[Op.substring]:key}},
            ]
        };
        if (key) {
            const condition:any[] = [];
            if (key) {
                condition.push(defaultSearch);
            }
            const result = await this.ctx.model.Roles.findAll({
                limit:pageSize,
                offset:(currentPage - 1) * pageSize,
                where:condition,
                include:[{model:Rights}]
            });
            const count = await this.ctx.model.Roles.findAndCountAll({where:condition});
            return {roles:result,count:count.count};
        } else {
            const result = await this.ctx.model.Roles.findAll({
                limit:pageSize,
                offset:(currentPage - 1) * pageSize,
                include:[{model:Rights}]
            });
            const totalCount = await this.ctx.model.Roles.findAndCountAll();
            return {roles:result, count:totalCount.count};
        }
    }
    public async getAllRoles() {
        const result = await this.ctx.model.Roles.findAll();
        return {roles:result};
    }
    public async createRole(data) {
        let {roleName} = data;
        let role;
        role = await this.ctx.model.Roles.findOne({where:{roleName}});
        if (role) {
            throw new Error("角色已存在");
        }
        const result = await this.ctx.model.Roles.create(data);
        return result;
    }
    public async delete(id) {
        const role = await this.ctx.model.Roles.findOne({where:id});
        if (role) {
            try{
                const data = await this.ctx.model.Roles.destroy({where:id});
                if (data > 0) {
                    return role;
                }else {
                    throw new Error('删除角色失败');
                }
            }catch (e) {
                return this.ctx.error(500,e.message)
            }
        } else {
            throw new Error("该角色不存在");
        }
    }
    public async edit(data){
        const id = data.id;
        delete data.id;
        const roleName = data.roleName;
        const res = await this.ctx.model.Roles.findOne({where:{id}});
        if (res) {
            let flag = await this.ctx.model.Roles.findOne({where:{roleName}});
            if (flag && flag['dataValues'].id != id) {
                throw new Error('角色已存在');
            }
            const role = await this.ctx.model.Roles.update(data,{where:{id}});
            return role;
        } else {
            throw new Error("该角色不存在")
        }
    }
}
