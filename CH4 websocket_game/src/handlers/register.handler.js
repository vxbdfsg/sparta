import { addUser } from '../models/user.model.js';
import { v4 as uuidv4 } from 'uuid';
import { handleConnection, handleDisconnect, handlerEvent } from './helper.js';

const registerHandler = (io) => {
    io.on('connection', (socket) => {
        // 이벤트 처리

        // 유저 접속
        const userUUID = uuidv4();
        addUser({ uuid: userUUID, socketId: socket.id });

        // 유저 등록
        handleConnection(socket, userUUID);
         
        // 이벤트 리스너
        socket.on('event', (data) => handlerEvent(io, socket, data));

        // 접속 해제
        socket.on('disconnect', (socket) => handleDisconnect(socket, userUUID));
    });
};

export default registerHandler;
