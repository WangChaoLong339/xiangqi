cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad: function () {
    },

    onEnable: function () {
        SocketCustom.on('onMessage', this.onMessage.bind(this))
        // 同步大厅
        SocketCustom.emit('message', { type: 'cts_sync_game', userId: User.userId })
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
            case 'stc_sync_game':
                break
            case 'stc_enter_game':
                break
            case 'stc_leave_game':
                cc.director.loadScene('Hall')
                break
            default:
                console.error(`${msg.type} is not exist`)
        }
    },

    onClickLeaveGame: function () {
        SocketCustom.emit('message', { type: 'cts_leave_game', userId: User.userId, })
    },
});
