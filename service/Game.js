(function () {
    const Util = require('./Util')

    let Game = {}
    Game.gameId2Game = { 999999: { id: 999999, ownerName: '山东红富士', ownerId: 888888, maxCount: 2, currCount: 2, users: [] } }
    Game.userId2GameId = {}
    Game.getAllGames = function () {
        let games = []
        for (var i in Game.gameId2Game) {
            // TODO 需要过滤部分信息
            games.push({
                id: Game.gameId2Game[i].id,
                ownerName: Game.gameId2Game[i].ownerName,
                ownerId: Game.gameId2Game[i].ownerId,
                maxCount: Game.gameId2Game[i].maxCount,
                currCount: Game.gameId2Game[i].currCount,
                users: Game.gameId2Game[i].users,

            })
        }
        return games
    }
    // 大厅同步
    Game.syncGames = function (data, response) {
        let msg = { err: '', type: 'stc_sync_hall', games: Game.getAllGames() }

        response(msg)
    }
    // 游戏同步
    Game.syncGame = function (data, response) {
        let game = Game.gameId2Game[data.gameId]
        let msg = { err: '', type: 'stc_sync_game', game: game }
        // TODO 需要过滤部分信息

        response(msg)
    }
    // 创建房间
    Game.createGame = function (data, response) {
        let game = {
            id: Util.randomInt(100000, 999999),
            ownerName: data.userName,
            ownerId: data.userId,
            maxCount: 2,
            currCount: 0,
            users: [],
        }
        Game.userId2GameId[data.userId] = game.id
        Game.gameId2Game[game.id] = game

        response({ err: '', type: 'stc_create_game', games: Game.getAllGames() })
    }
    // 进入房间
    Game.enterGame = function (data, response) {
        let game = Game.gameId2Game[data.gameId]
        let msg = { err: '', type: 'stc_enter_game', game: game }

        response(msg)
    }

    module.exports = Game
})()