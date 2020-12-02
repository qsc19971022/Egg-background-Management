import { Controller } from 'egg';
import addRoleRule from "../validate/addRoleRule";
export default class usersController extends Controller {
    public  async getRoles() {
        const {ctx} = this;
        let roles;
        try{
            if (Object.keys(ctx.query).length !== 0) {
                roles = await ctx.service.roles.getRoles(ctx.query);
            } else {
                roles = await ctx.service.roles.getAllRoles();
            }
            ctx.success(roles);
        }catch (e) {
            ctx.error(500,e.message);
        }
    }
    public async create() {
        const { ctx } = this;
        const data = ctx.request.body;
        try {
            ctx.validate(addRoleRule,data);
            const role = await this.ctx.service.roles.createRole(data);
            this.ctx.success({role});
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
            const role = await ctx.service.roles.delete(id);
            ctx.success({role});
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
            ctx.validate(addRoleRule,data);
            const role = await ctx.service.roles.edit(data);
            ctx.success({role});
        }catch (e) {
            if (e.errors){
                this.ctx.error(500,e.errors);
            } else {
                this.ctx.error(500,e.message);
            }
        }
    }
}
