export default {
    async createPhoneCode(ctx,phone){
        let code = '';
        for(let i=0;i<6;i++){
            let random = Math.floor(Math.random()*10);
            code += random;
        }
        let res = await ctx.service.test.sendCode(phone,code);
        let data = JSON.parse(res);
        if (data.status === 0) {
            ctx.session.phone = {
                phone,
                code,
                expire:Date.now() + 60 * 1000 * 60
            };
        }
        return data
    },
    validatePhoneCode(ctx,phone,code) {
        let serverCode = ctx.session.phone.code;
        let clientCode = code;
        let serverPhone =ctx.session.phone.phone;
        let expire = ctx.session.phone.expire;
        let clientTime = Date.now();
        if (clientTime > expire) {
            throw new Error("验证码已过期");
        } else if(serverCode !== clientCode || phone !==serverPhone){
            throw new Error("验证码错误");
        } else {
            ctx.session.phone = null;
            return ctx.success({msg:'注册成功'});
        }
    }
}