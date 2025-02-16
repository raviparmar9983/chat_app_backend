import * as config from 'config';
import connection from 'src/db/db.connection';
import app from './src/app'
import { Server } from "socket.io";

connection()
const PORT = config.get('PORT')

const server = app.listen(PORT, () => {
    console.info(`Server Started On ${PORT}`);
})

// const socketServer = new Server(server, {
//     pingTimeout: 600000,
//     cors: {
//         origin: config.get('ORIGIN')
//     }
// })

// socketServer.on('connection', (socket) => {
//     console.log("connected to socket.io")

//     socket.on('setup', (userData) => {
//         //create room
//         socket.join(userData._id);
//         console.log(userData._id);

//         socket.emit('connected')
//     })

//     socket.on('join chat', (room) => {
//         socket.join(room);
//         console.log('user Join room', room)
//     })
// })