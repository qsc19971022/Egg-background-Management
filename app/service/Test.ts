import { Service } from 'egg';
export default class Test extends Service {
  public async sendCode(phone: number,code:string) {
    const result = await this.ctx.curl(`https://api.jisuapi.com/sms/send?mobile=${phone}&content=您的手机验证码为${code}，5分钟内有效。请不要把此验证码泄露给任何人。【Simon】&appkey=06d97dfdd1fd0bb5`);
    return result.data;
  }
}
