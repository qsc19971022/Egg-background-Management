import { Controller } from 'egg';

export default class roleRightsController extends Controller {
    public async create() {
        const { ctx } = this;
        let {roleId,rightsId} = ctx.request.body;
        let transaction;
        try{
            transaction = await ctx.model.transaction();
            for (let i = 0; i < rightsId.length; i++) {
                const data = {roleId,rightsId:rightsId[i]};
                await ctx.service.roleRights.create(data);
            }
            await transaction.commit();
            ctx.success();
        }catch (e) {
            await transaction.rollback();
            ctx.error(400,e.message);
        }
    }
    public async deleteRoleRight() {
        const { ctx } = this;
        let {roleId,rightsId} = ctx.request.body;
        let transaction;
        try{
            transaction = await ctx.model.transaction();
            for (let i = 0; i < rightsId.length; i++) {
                const data = {roleId,rightsId:rightsId[i]};
                await ctx.service.roleRights.delete(data);
            }
            await transaction.commit();
            ctx.success();
        }catch (e) {
            await transaction.rollback();
            ctx.error(400,e.message);
        }
    }
}
