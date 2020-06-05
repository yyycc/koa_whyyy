const model = require('../model');
let User = model.User;

/**
 * /user/query
 * 根据条件查询用户
 * 获取拼接在url上查询条件
 */
let query = async (ctx, next) => {
    // 获取参数ctx.query
    let data = await User.findAll({
        where: ctx.query
    });
    let res = {
        success: true,
        data: data
    };
    ctx.status = 200;
    ctx.body = res;
};

let updateByName = async (ctx, next) => {
    // 获取参数ctx.query
    let dataOld = await User.findAll({
        where: {name: ctx.query.name}
    });

    for (let d of dataOld) {
        d.last_update_date = Date.now();
        await d.save();
    }
    let data = await User.findAll({
        where: {name: ctx.query.name}
    });
    let res = {
        success: true,
        data: data
    };
    ctx.status = 200;
    ctx.body = res;
};


module.exports = {
    'GET /user/query': query,
    'GET /user/updateByName': updateByName,
};
