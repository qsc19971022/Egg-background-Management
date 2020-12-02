module.exports = {
    success(data, status = 200, msg = '请求成功') {
        // this.status = status; // Resetful API
        // this 就是 ctx 对象，在其中可以调用 ctx 上的其他方法，或访问属性
        this.body = {
            status: status,
            msg:msg,
            result:data
        }
    },
    error(status = 500, msg='请求错误') {
        // this.status = status;
        // this 就是 ctx 对象，在其中可以调用 ctx 上的其他方法，或访问属性
        this.body = {
            status:status,
            msg:msg
        }
    }
};