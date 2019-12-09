cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Node,
        gameItem: cc.Node,
    },

    onLoad: function () {
        this.games = []
    },

    onEnable: function () {
        SocketCustom.on('onMessage', this.onMessage.bind(this))
        // 同步大厅
        SocketCustom.emit('message', { type: 'cts_sync_hall', userId: User.userId })
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
            case 'stc_sync_hall':
                this.games = msg.games
                this.showGames()
                break
            case 'stc_create_game':
                this.games = msg.games
                this.showGames(msg)
                break
            default:
                console.error(`${msg.type} is not exist`)
        }
    },

    showGames: function () {
        this.content.removeAllChildren()
        for (var i = 0; i < this.games.length; i++) {
            let game = this.games[i]
            let gameItem = cc.instantiate(this.gameItem)
            gameItem.gameId = game.id
            gameItem.PathChild('gameId', cc.Label).string = game.id
            gameItem.PathChild('ownerName', cc.Label).string = `房主:${game.ownerName}`
            gameItem.PathChild('ownerId', cc.Label).string = `ID:${game.ownerId}`
            gameItem.PathChild('count', cc.Label).string = `${game.currCount}/${game.maxCount}`
            this.content.addChild(gameItem)
        }
    },

    onClickCreateGame: function () {
        // 创建房间
        SocketCustom.emit('message', {
            type: 'cts_create_game',
            userId: User.userId,
            userName: User.name,
        })
    },

    onClickGameItem: function (event) {
        let gameId = event.target.gameId
        // 进入房间
        SocketCustom.emit('message', {
            type: 'cts_enter_game',
            userId: User.userId,
            gameId: gameId,
        })
    },
});
