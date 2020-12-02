import { Controller } from 'egg';

export default class userRoleController extends Controller {
    public async create() {
        const { ctx } = this;
        await ctx.service.userRole.create(ctx.request.body);
    }
    public async deleteUserRole() {
        const { ctx } = this;
        await ctx.service.userRole.delete(ctx.query);
    }
}
