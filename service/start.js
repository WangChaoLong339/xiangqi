(function () {
    const io = require('socket.io')(3002)

    const Login = require('./Login')
    const Hall = require('./Hall')
    const Game = require('./Game')
    console.log('/************************************************************************/')
    console.log('/*                 服       务       器       启       动               */')
    console.log('/************************************************************************/')
    io.on('connection', (socket) => {
        // 断开
        socket.on('disconnect', (err) => {
        })
        // 登陆
        socket.on('message', (data) => {
            switch (data.type) {
                case 'cts_login':
                    Login.login(data, (msg) => {
                        socket.join('hall')
                        socket.emit('onMessage', msg)
                    })
                    break
                case 'cts_sync_hall':
                    Hall.syncHall(data, (msg) => {
                        socket.emit('onMessage', msg)
                    })
                    break
                case 'cts_sync_game':
                    // Game.syncGame(data, (msg) => {
                    //     socket.emit('onMessage', msg)
                    // })
                    break
                case 'cts_create_game':
                    Game.createGame(data, (msg) => {
                        io.in('hall').emit('onMessage', msg)
                    })
                    break
                case 'cts_enter_game':
                    break
                default:
                    console.error(`${data.type} is not exist`)
            }
        })
    })
}())