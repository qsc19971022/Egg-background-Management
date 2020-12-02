import { Service } from 'egg';
const { Op } = require("sequelize");
export default class Test extends Service {
    public async getRights(data) {
        let {currentPage, pageSize, key} = data;
        currentPage = parseInt(currentPage);
        pageSize = parseInt(pageSize);
        const defaultSearch = {
            [Op.or]:[
                {right_name:{[Op.substring]:key}},
            ]
        };
        if (key) {
            const condition:any[] = [];
            condition.push(defaultSearch);
            const result = await this.ctx.model.Rights.findAll({
                limit:pageSize,
                offset:(currentPage - 1) * pageSize,
                where:condition
            });
            const count = await this.ctx.model.Rights.findAndCountAll({where:condition});
            return {roles:result,count:count.count};
        } else {
            const result = await this.ctx.model.Rights.findAll({
                limit:pageSize,
                offset:(currentPage - 1) * pageSize,
            });
            const totalCount = await this.ctx.model.Rights.findAndCountAll();
            return {rights:result, count:totalCount.count};
        }
    }
    public async getAllRights() {
        let result = await this.ctx.model.Rights.findAll();
        result = result.filter((data:any) => {
            result.forEach((res:any) => {
                if (data.dataValues.id == res.dataValues.pid) {
                    data.dataValues.children ? '':data.dataValues.children = [];
                    data.dataValues.children.push(res);
                }
            });
            return data.level === 0;
        });
        return result;
    }
    public async createRight(data) {
        try{
            const result = await this.ctx.model.Rights.create(data);
            return result;
        }catch (e) {
            throw new Error(e.message);
        }
    }
    public async delete(id) {
        const right = await this.ctx.model.Rights.findOne({where:id});
        if (right) {
            try{
                const data = await this.ctx.model.Rights.destroy({where:id});
                if (data > 0) {
                    return right;
                }else {
                    throw new Error('删除权限失败');
                }
            }catch (e) {
                return this.ctx.error(500,e.message)
            }
        } else {
            throw new Error("该权限不存在");
        }
    }
    public async edit(data){
        const id = data.id;
        delete data.id;
        const rightName = data.rightName;
        const res = await this.ctx.model.Rights.findOne({where:{id}});
        if (res) {
            let flag = await this.ctx.model.Rights.findOne({where:{rightName}});
            if (flag && flag['dataValues'].id != id) {
                throw new Error('权限已存在');
            }
            const right = await this.ctx.model.Rights.update(data,{where:{id}});
            return right;
        } else {
            throw new Error("该权限不存在")
        }
    }
}
