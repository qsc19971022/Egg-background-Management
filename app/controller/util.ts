import { Controller } from 'egg';
export default class UtilController extends Controller {
    public async imageCaptcha() {
        const {ctx} = this;
        ctx.response.type = "image/svg+xml";
        ctx.body = ctx.helper.createImageCode();
    }
    public async validateCode() {
        const { ctx } = this;
        let {clientCode} = ctx.query;
        ctx.helper.validateImageCode(clientCode);
    }
    public async phoneCode() {
        const {ctx} = this;
        let {phone} = ctx.query;
        let data = await ctx.helper.createPhoneCode(phone);
        if (data.status === 0) {
            return ctx.success({msg:'验证码发送成功'});
        }else{
            return ctx.error();
        }
    }
    public async validatePhoneCode() {
        const {ctx} = this;
        let {phone,code} = ctx.request.body;
        ctx.helper.validatePhoneCode(phone,code);
    }
}
