(function () {
    const Util = require('./Util')

    let Game = {}
    Game.gameId2Game = {}
    // Game.gameId2Game[888888] = { id: 888888, ownerName: '系统房间', ownerId: 888888, maxCount: 2, users: [{ userId: 888888 }, { userId: 999999 }] }
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
                users: Game.gameId2Game[i].users,

            })
        }
        return games
    }
    // 大厅同步
    Game.syncGames = function (data, response) {
        let msg = { err: '', type: 'stc_sync_hall', gameId: Game.userId2GameId[data.userId], games: Game.getAllGames() }

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
            ownerName: data.user.name,
            ownerId: data.user.userId,
            maxCount: 2,
            currCount: 0,
            users: [],
        }
        Game.gameId2Game[game.id] = game

        response({ err: '', type: 'stc_create_game', games: Game.getAllGames() })
    }
    // 进入房间
    Game.enterGame = function (data, response) {
        Game.userId2GameId[data.user.userId] = data.gameId
        let game = Game.gameId2Game[data.gameId]
        let user = {
            userId: data.user.userId,
            name: data.user.name,
        }
        game.users.push(user)
        let msg = { err: '', type: 'stc_enter_game', userId: data.user.userId, gameId: game.id, games: Game.getAllGames() }

        response(msg)
    }
    // 离开房间
    Game.leaveGame = function (data, response) {
        let gameId = Game.userId2GameId[data.userId]
        if (!gameId) {
            response({ err: '玩家不在房间' })
            return
        }
        let game = Game.gameId2Game[gameId]
        let i = 0
        for (; i < game.users.length; i++) {
            if (game.users[i].userId == data.userId) {
                break
            }
        }
        game.users.splice(i, 1)
        delete Game.userId2GameId[data.userId]

        response({ err: '', type: 'stc_leave_game', userId: data.userId, gameId: gameId })
    }

    module.exports = Game
})()