import imageCode from '../util/imageCode';
import phoneCode from "../util/phoneCode";
import encrypto from "../util/encrypto";
module.exports = {
    createImageCode() {
        return imageCode.createImageCode(this.ctx);
    },
    validateImageCode(code) {
        imageCode.validateImageCode(this.ctx,code)
    },
    createPhoneCode(phone) {
        return phoneCode.createPhoneCode(this.ctx,phone);
    },
    validatePhoneCode(phone,code) {
        phoneCode.validatePhoneCode(this.ctx,phone,code);
    },
    encryptText(text){
        return encrypto.encryptText(this, text);
    },
};