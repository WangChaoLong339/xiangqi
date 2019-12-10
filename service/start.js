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
                        if (msg.err == '') {
                            socket.join('hall')
                        }
                        socket.emit('onMessage', msg)
                    })
                    break
                case 'cts_sync_hall':
                    Hall.syncHall(data, (msg) => {
                        if (msg.gameId) {
                            socket.leave('hall')
                            socket.join(msg.gameId)
                        }
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
                        if (msg.err == '') {
                            io.in('hall').emit('onMessage', msg)
                        } else {
                            socket.emit('onMessage', msg)
                        }
                    })
                    break
                case 'cts_enter_game':
                    Game.enterGame(data, (msg) => {
                        if (msg.err == '') {
                            io.in('hall').emit('onMessage', msg)
                            io.in(msg.gameId).emit('onMessage', msg)
                            socket.leave('hall')
                            socket.join(msg.gameId)
                        } else {
                            socket.emit('onMessage', msg)
                        }
                    })
                    break
                case 'cts_leave_game':
                    Game.leaveGame(data, (msg) => {
                        if (msg.err == '') {
                            io.in(msg.gameId).emit('onMessage', msg)
                            socket.leave(msg.gameId)
                            socket.join('hall')
                        } else {
                            socket.emit('onMessage', msg)
                        }
                    })
                    break
                default:
                    console.error(`${data.type} is not exist`)
            }
        })
    })
}())