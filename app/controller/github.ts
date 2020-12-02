import { Controller } from 'egg';
const queryString = require('querystring');
const jwt = require('jsonwebtoken');
import { v4 as uuidv4 } from 'uuid';
export default class githubController extends Controller {
    public async getLogin() {
        const { ctx } = this;
        const baseUrl = 'https://github.com/login/oauth/authorize';
        const option = {
            client_id:'de436baf2dd677a6c2fa',
            scope:'user'
        };
        const url = baseUrl + '?' + queryString.stringify(option);
        ctx.redirect(url);
    }
    public async getToken() {
        const { ctx } = this;
        const baseUrl = 'https://github.com/login/oauth/access_token';
        const {code} = ctx.query;
        const option = {
            client_id:'de436baf2dd677a6c2fa',
            client_secret:'c502ded93218d0565203abe602e6b9b75d6aea11',
            code: code
        };
        const result = await ctx.curl(baseUrl,{
            method:'POST',
            data:option,
            dataType:'json',
            headers:{
                'Content-Type': 'application/json',
                'Accept':'application/json'
            }
        });
        const token = result.data.access_token;
        await this.getGithubUserInfo(token);
    }
    private async getGithubUserInfo(token) {
        const { ctx } = this;
        const baseUrl = `https://api.github.com/user?access_token=${token}`;
        const result = await ctx.curl(baseUrl);
        const data = JSON.parse(result.data);
        const option = {
            id: data.id,
            provider:'github'
        };
       await this.goGithubLogin(option,token);
    }
    private async goGithubLogin(option,access_token){
        const { ctx } = this;
        try {
            const user = await ctx.service.oauth.getUser(option);
            const token = jwt.sign(user,this.config.keys,{expiresIn:'7 days'});
            ctx.cookies.set('token',token,{
                path:'/',
                maxAge:24 * 60 * 60 * 1000,
                httpOnly: false
            });
            ctx.redirect("http://127.0.0.1:8080/home");
        }catch (e) {
            // 用户不存在
            const userInfo = {
                username:uuidv4(),
                password:'www.woftsun.com',
                github:1
            };
            const user = await ctx.service.user.createUser(userInfo);
            const oauthInfo = {
                accessToken:access_token,
                uid:option.id,
                userId:user.id,
                provider:'github'
            };
            await ctx.service.oauth.createOauth(oauthInfo);
            const token = jwt.sign(user,this.config.keys,{expiresIn:'7 days'});
            ctx.cookies.set('token',token,{
                path:'/',
                maxAge:24 * 60 * 60 * 1000,
                httpOnly: false
            });
            ctx.redirect("http://127.0.0.1:8080/home");
        }
    }
}
