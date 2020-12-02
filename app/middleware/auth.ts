const jwt = require('jsonwebtoken');

const getActionRights = (ctx) => {
    let data:any = ctx.session.userInfo;
    if (!data) return null;
    const actionRights = data.allRights.filter((action:any)=> {
        if (action.rightType === 'action') return action;
    });
    let arr:any[] = [];
    if (actionRights.length === 0) {
        return actionRights;
    }
    if (actionRights[0].rightPath) {
        arr.push(actionRights[0].rightPath);
    }
    actionRights[0].children.map((item:any) => {
        if (item.rightPath) {
            arr.push(item.rightPath);
        }
        if (item.children) {
            item.children.map((res:any) => {
                arr.push(res.rightPath);
            })
        }
    });
    return arr;
};
const isNext = (actionList:any,toPath:any) => {
    if (actionList.includes(toPath)) return true;
};
let actionRights;
module.exports = (_options,app) => {
    return async function auth(ctx, next) {
        let curPath = ctx.url;
        if (!curPath.startsWith('/api/v1')){
            await next();
            return
        }
        if (!actionRights) {
            actionRights = getActionRights(ctx);
        }
        if (!actionRights) {
            return ctx.error(400,'没有权限');
        }
        const index = curPath.indexOf('?');
        if (index !== -1) {
            curPath = curPath.substr(0,index);
        }
        const flag = isNext(actionRights,curPath);
        if (flag) {
            const token = ctx.cookies.get('token');
            if (token) {
                try{
                    await jwt.verify(token,app.config.keys);
                    await next();
                }catch (e) {
                    ctx.error(400,'没有权限');
                }
            } else {
                ctx.error(400,'没有权限');
            }
        } else {
            ctx.error(400,'没有权限');
        }
        // 1.获取需要权限鉴定的路由
        // const authUrls = options.baseUrls;
        // if (authUrls.includes(ctx.url)) {
        //     const token = ctx.cookies.get('token');
        //     if (token) {
        //         try{
        //             await jwt.verify(token,app.config.keys);
        //             await next();
        //         }catch (e) {
        //             ctx.error(400,'没有权限');
        //         }
        //     } else {
        //         ctx.error(400,'没有权限');
        //     }
        // } else {
        //     await next();
        // }
    };
};