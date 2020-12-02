import { Controller } from 'egg';
import addRightRule from "../validate/addRightRule";
export default class rightController extends Controller {
    public async getRights() {
        const {ctx} = this;
        if (JSON.stringify(ctx.query) !== '{}') {
            const rights = await ctx.service.rights.getRights(ctx.query);
            ctx.success(rights);
        } else {
            const rights = await ctx.service.rights.getAllRights();
            ctx.success(rights);
        }
    }
    public async create() {
        const { ctx } = this;
        const data = ctx.request.body;
        try {
            ctx.validate(addRightRule,data);
            const rights = await this.ctx.service.rights.createRight(data);
            ctx.success({rights});
        } catch (e) {
            if (e.errors){
                this.ctx.error(500,e.errors);
            } else {
                this.ctx.error(500,e.message);
            }
        }
    }
    public async deleteOne(){
        const { ctx } = this;
        const id = ctx.query;
        try{
            const right = await ctx.service.rights.delete(id);
            ctx.success({right});
        }catch (e) {
            if (e.errors){
                this.ctx.error(500,e.errors);
            } else {
                this.ctx.error(500,e.message);
            }
        }
    }
    public async edit(){
        const {ctx} = this;
        const data = ctx.query;
        try{
            ctx.validate(addRightRule,data);
            const right = await ctx.service.rights.edit(data);
            ctx.success({right});
        }catch (e) {
            if (e.errors){
                this.ctx.error(500,e.errors);
            } else {
                this.ctx.error(500,e.message);
            }
        }
    }
}
