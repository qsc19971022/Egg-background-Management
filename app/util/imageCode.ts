import svgCaptcha = require('svg-captcha');
export default {
    createImageCode(ctx){
        let code = svgCaptcha.create({
            ignoreChars: '0o1i',
            noise: 4,
            color: true,
            background: '#8cc5ff'
        });
        let serverCode = code.text;
        ctx.session.captche = {
            serverCode,
            expire:Date.now() + 60 * 1000
        };
        return code.data;
    },
    validateImageCode(ctx,clientCode){
        let serverCode;
        let expire;

        serverCode = ctx.session.captche.serverCode;
        expire = ctx.session.captche.expire;
        let serverCode_up = serverCode.toUpperCase();
        let serverCode_low = serverCode.toLowerCase();
        let clientTime = Date.now();
        if (clientTime > expire) {
            ctx.session.captche = null;
            throw new Error("验证码已过期");
        }else if (serverCode !== clientCode.code && serverCode_up != clientCode.code && serverCode_low != clientCode.code) {
            ctx.session.captche = null;
            throw new Error("验证码不正确");
        }
        ctx.session.captche = null;
    }
}