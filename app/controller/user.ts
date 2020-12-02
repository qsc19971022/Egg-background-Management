import { Controller } from 'egg';
import userRule from "../validate/userRule";
import phoneRule from "../validate/phoneRule";
import emilRule from "../validate/emilRule";
const jwt = require('jsonwebtoken');
export default class UserController extends Controller {
    public async create() {
        try {
            this.validateUserInfo();
            this.validateUserCode();
            const data = await this.ctx.service.user.createUser(this.ctx.request.body);
            this.ctx.success({data});
            this.ctx.session.captche = null;
        } catch (e) {
            if (e.errors){
                this.ctx.error(400,e.errors);
            } else {
                this.ctx.error(400,e.message);
            }
        }
    }
    private validateUserInfo() {
        const { ctx } = this;
        let data = ctx.request.body;
        let {type} = ctx.request.body;
        switch (type) {
            case 'normal':
                ctx.validate(userRule,data);
                break;
            case 'email':
                ctx.validate(emilRule,data);
                break;
            case 'phone':
                ctx.validate(phoneRule,data);
                break;
            default:
                throw new Error("没有对应的类型");
        }
    }
    private validateUserCode() {
        const { ctx } = this;
        let data = ctx.request.body;
        let {phone,code,type} = ctx.request.body;
        switch (type) {
            case 'normal':
                ctx.helper.validateImageCode(data);
                break;
            case 'email':
                ctx.validate(emilRule,data);
                break;
            case 'phone':
                ctx.helper.validatePhoneCode(phone,code);
                break;
            default:
                throw new Error("没有对应的类型");
        }
    }
    public async index() {
        const { ctx } = this;
        try{
            this.validateUserInfo();
            let data = ctx.request.body;
            ctx.helper.validateImageCode(data);
            const user = await ctx.service.user.getUser(data);
            if (!user.status) {
                return ctx.error(400,"用户已被注销");
            }
            const option = {
                username:user.username,
                email:user.email,
                phone:user.phone
            };
            const token = jwt.sign(option,this.config.keys,{expiresIn:'7 days'});
            ctx.cookies.set('token',token,{
                path:'/',
                maxAge:24 * 60 * 60 * 1000,
                httpOnly: false
            });
            ctx.session.userInfo = user;
            ctx.success(user);
        } catch (e) {
            if (e.errors) {
                ctx.error(400,e.errors);
            }else {
                ctx.error(400,e.message);
            }
        }

    }
}
