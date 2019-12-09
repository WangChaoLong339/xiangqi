(function () {
    const Game = require('./Game')
    let Hall = {}

    Hall.syncHall = function (data, response) {
        Game.syncGames(data, response)
    }

    module.exports = Hall
})()