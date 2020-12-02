import { Service } from 'egg';
export default class userRole extends Service {
    public async create(data) {
        const {ctx} = this;
        try{
            const result = await ctx.model.UserRole.create(data);
            return ctx.success({result});
        }catch (e) {
            throw new Error('角色分配失败');
        }
    }
    public async delete(data) {
        const {ctx} = this;
        try{
            const result = await ctx.model.UserRole.destroy({where:data});
            return ctx.success({result});
        }catch (e) {
            throw new Error('角色删除失败');
        }
    }
}
