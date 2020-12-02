import { Service } from 'egg';
export default class roleRights extends Service {
    public async create(data) {
        const {ctx} = this;
        try{
            const roleRights = await ctx.model.RoleRights.findOne({
                where:{
                    roleId:data.roleId,
                    rightsId:data.rightsId
                }
            });
            if (roleRights) {
                throw new Error('权限分配失败');
            }
            let result = await ctx.model.RoleRights.create(data);
            // result = result['dataValues'];
            return ctx.success({result});
        }catch (e) {
            throw new Error('权限分配失败');
        }
    }
    public async delete(data) {
        const {ctx} = this;
        try{
            const result = await ctx.model.RoleRights.destroy({where:data});
            return ctx.success({result});
        }catch (e) {
            throw new Error('权限删除失败');
        }
    }
}
