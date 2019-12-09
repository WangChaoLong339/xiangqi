cc.Class({
    extends: cc.Component,

    properties: {
        acc: cc.EditBox,
        pwd: cc.EditBox,
    },

    onLoad: function () {
    },

    onEnable: function () {
        SocketCustom.on('onMessage', this.onMessage.bind(this))
    },

    onDisable: function () {
        SocketCustom.removeListener('onMessage')
    },

    onMessage: function (msg) {
        if (msg.err != '') {
            console.log(msg.err)
            return
        }

        switch (msg.type) {
            case 'stc_login':
                this.onLogin(msg)
                break
            default:
                console.error(`${msg.type} is not exist`)
        }
    },

    onLogin: function (msg) {
        window.User = msg.user
        cc.director.loadScene('Hall')
    },

    onClickLogin: function () {
        let msg = {
            type: 'cts_login',
            userId: this.acc.string,
            pwd: this.pwd.string,
        }
        SocketCustom.emit('message', msg)
    },
});
