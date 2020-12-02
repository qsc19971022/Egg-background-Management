import { Service } from 'egg';
import {User} from "../model/user";
export default class Oauth extends Service {
    public async getUser({id,provider}) {
        const result = await this.ctx.model.Oauth.findOne({
            where:{
                uid:id,
                provider:provider
            },
            include:[{model:User}]
        });
        try{
            return result!.dataValues.user!.dataValues
        }catch (e) {
            throw new Error("授权用户不存在");
        }
    }
    public async createOauth(info) {
        return await this.ctx.model.Oauth.create(info);
    }
}
