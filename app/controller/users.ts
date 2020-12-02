import { Controller } from 'egg';
import addUserRole from "../validate/addUserRole";
import editUserRole from "../validate/editUserRole";
const path = require('path');
const fs = require('fs');
const xlsx = require('node-xlsx');
export default class usersController extends Controller {
    public async index() {
        const { ctx } = this;
        try{
            const users = await ctx.service.users.getAll();
            ctx.success(users);
        }catch (e) {
            ctx.error(500,e.message);
        }
    }
    public  async getUsers() {
        const {ctx} = this;
        try{
            const users = await ctx.service.users.getUsers(ctx.query);
            ctx.success(users);
        }catch (e) {
            ctx.error(500,e.message);
        }
    }
    public async create() {
        const { ctx } = this;
        const data = ctx.request.body;
        try {
            ctx.validate(addUserRole,data);
            const user = await this.ctx.service.users.createUser(data);
            this.ctx.success({user});
        } catch (e) {
            if (e.errors){
                this.ctx.error(500,e.errors);
            } else {
                this.ctx.error(500,e.message);
            }
        }
    }
    public async delete() {
        const {ctx} = this;
        const id = ctx.query;
        try{
            const user = await ctx.service.users.delete(id);
            ctx.success({user});
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
            ctx.validate(editUserRole,data);
            const user = await ctx.service.users.edit(data);
            ctx.success({user});
        }catch (e) {
            if (e.errors){
                this.ctx.error(500,e.errors);
            } else {
                this.ctx.error(500,e.message);
            }
        }
    }
    public async upload() {
        const {ctx} = this;
        const file = ctx.request.files[0];
        const fileName = ctx.helper.encryptText(file.filename + Date.now()) + path.extname(file.filename);
        let filePath = path.join('/public/upload/',fileName);
        const absFilePath = path.join(this.config.baseDir,'app',filePath);
        const readStream = fs.readFileSync(file.filepath);
        fs.writeFileSync(absFilePath,readStream);
        filePath = filePath.replace(/\\/g,'/');
        ctx.success(filePath);
    }
    public async import() {
        const {ctx} = this;
        let transaction;
        try{
            const file = ctx.request.files[0];
            const worksheets = xlsx.parse(fs.readFileSync(file.filepath));
            const sheet = worksheets.length ? worksheets[0] : null;
            const sheetData = sheet ? sheet.data : [];
            const users:any = [];
            transaction =await ctx.model.transaction();
            for (let i = 1; i < sheetData.length; i ++) {
                const cloumKey = sheetData[0];
                const cloumValue = sheetData[i];
                const user:any = {};
                for (let j = 0; j < cloumKey.length; j ++ ) {
                    user[cloumKey[j]] = cloumValue[j];
                }
                await ctx.service.users.createUser(user);
                users.push(user);
            }
            await transaction.commit();
            ctx.success({users});
        }catch (e) {
            await transaction.rollback();
            ctx.error(500,e.message);
        }
    }
}
