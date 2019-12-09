(function () {
    let userId2User = {
        1: { userId: 1, pwd: 1, name: '风吹鸡蛋壳', coin: 10000 },
        2: { userId: 2, pwd: 2, name: '财去人安乐', coin: 88888 },
    }
    let Login = {}
    Login.login = function (data, response) {
        let msg = { err: '', type: 'stc_login', user: { userId: data.userId } }
        if (typeof userId2User[data.userId] == undefined) {
            msg.err = '账号不存在'
        } else if (userId2User[data.userId].pwd != data.pwd) {
            msg.err = '密码错误'
        }
        msg.user = {
            userId: data.userId,
            name: userId2User[data.userId].name,
            coin: userId2User[data.userId].coin,
        }

        response(msg)
    }

    module.exports = Login
})()