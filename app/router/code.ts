module.exports = (app) => {
    app.router.get('/imagecode',app.controller.util.imageCaptcha);  // 获取图形验证码
    app.router.get('/code',app.controller.util.validateCode);  // 验证图形验证码
    app.router.get('/phone',app.controller.util.phoneCode);  // 获取手机验证码
    app.router.post('/sendcode',app.controller.util.validatePhoneCode);  // 发送手机验证码
}