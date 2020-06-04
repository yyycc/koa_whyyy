const model = require('../model');
let User = model.User;

// queryAll
let queryAll = async (ctx, next) => {
    let cyy = await User.findAll({
        where: {
            name: 'cyy'
        }
    });
    console.log('queryAll：');
    ctx.response.body = 'ok';
    console.log(cyy);
};

module.exports = {
    'GET /user/queryAll': queryAll
};
