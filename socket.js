const SocketIO = require('socket.io');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const cookie = require('cookie-signature');


module.exports = (server, app, sessionMiddleware) => {
    const io = SocketIO(server, { path: '/socket.io' });

    app.set('io', io);
    const room = io.of('/room');
    const chat = io.of('/chat');

    const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
    chat.use(wrap(cookieParser(process.env.COOKIE_SECRET)));
    chat.use(wrap(sessionMiddleware));

    room.on('connection', (socket) => {
        console.log('room 네임스페이스에 접속');
        socket.on('disconnect', () => {
            console.log('room 네임스페이스 접속 해제');
        });
    });

    chat.on('connection', (socket) => {
        console.log('chat 네임스페이스에 접속');
        const req = socket.request;
        const {headers: {referer}} = req;
        const roomId = referer
            .split('/')[referer.split('/').length - 1]
            .replace(/\?.+/, '');
        socket.join(roomId);
        socket.to(roomId).emit('join', { // 특정 방에 메세지 보내기, 세션 미들웨어와 Socket.IO를 연결했으므로 웹소켓에서 세션 사용 가능
            user: 'system',
            chat: `${req.session.color}님이 입장하셨습니다.`,
        });
        
        socket.on('disconnect', () => { // 접속 해제시에는 현재 방 사람 수 구해서 참여자 수 0명이면 방을 제거하는 http 요청
            console.log('chat 네임스페이스 접속 해제');
            socket.leave(roomId);
            const currentRoom = socket.adapter.rooms[roomId]; // 참여중인 소켓 정보
            const userCount = currentRoom ? currentRoom.length : 0;
            if (userCount === 0) { // 유저가 0명이면 방 삭제
                // express-session에서는 세션 쿠키인 req.signedCookies['connect.sid']를 보고 현재 세션이 누구에게 속해 있는지를 판단
                const signedCookie = cookie.sign( req.signedCookies['connect.sid'], process.env.COOKIE_SECRET ); 
                const connectSID = `${signedCookie}`;
                // 브라우저에서 axios 로 보낼때는 자동으로 쿠키를 같이 넣어서 보내지만 서버에서 보낼때는 쿠키가 같이 보내지지 않음. 따라서 직접 쿠키를 요청 헤더에 넣어줘야함.
                axios.delete(`http://localhost:8005/room/${roomId}`, {
                    headers: {
                        Cookie: `connect.sid=s%3A${connectSID}` //express-session에선 세션쿠키앞에 s%3A 붙여야함(6.2.5절 참조)
                    }
                })
                    .then(() => {
                        console.log('방 제거 요청 성공');
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            } else {
                socket.to(roomId).emit('exit', {
                    user: 'system',
                    chat: `${req.session.color}님이 퇴장하셨습니다.`,
                })
            }
        });
    });
};
/*    io.on('connection', (socket) => { // 웹소켓 연결 시
        const req = socket.request;
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log('새로운 클라이언트 접속!', ip, socket.id, req.ip);
        socket.on('disconnect', () => { // 연결 종료 시
            console.log('클라이언트 접속 해제', ip, socket.id);
            clearInterval(socket.interval);
        });
        socket.on('error', (error) => { // 에러 시
            console.error(error);
        });
        socket.on('reply', (data) => { // 클라이언트로부터 메세지
            console.log(data);
        });
        socket.interval = setInterval(() => { // 3초마다 클라이언트로 메세지 전송
            socket.emit('news', 'Hello Socket.IO'); // 첫 번째 인수는 이벤트 이름, 두 번째 인수는 데이터
        }, 3000);
    });
};*/

/*
ws모듈 활용시 예제
const WebSocket = require('ws');

module.exports = (server) => {
    const wss = new WebSocket.Server({ server });
    // 웹 소켓은 서버에서 설정한다고 작동하는 것이 아님, 쌍방향이기 때문에 클라이언트단에서도 작업을 해야함.
    wss.on('connection', (ws, req) => { // 웹소켓 연결 시
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; // 클라이언트 ip, proxy-addr 패키지 이용도 가능
        console.log('새로운 클라이언트 접속', ip);
        ws.on('message', (message) => { // 클라이언트로부터 메시지
            console.log(message);
        });
        ws.on('error', (error) => { // 에러 시
            console.error(error);
        });
        ws.on('close', () => { // 연결 종료 시
            console.log('클라이언트 접속 해제', ip);
            clearInterval(ws.interval); // 이 부분이 없으면 메모리 누수 발생
        });

        ws.interval = setInterval(() => { // 3초마다 연결된 모든 클라이언트로 메시지 전송
            if (ws.readyState === ws.OPEN) { // 웹소켓의 네 가지 상태. CONNECTING(연결 중) OPEN(열림) CLOSING(닫는 중) CLOSED(닫힘), OPEN일 때만 에러없이 메세지를 보낼 수 있다.
                ws.send('서버에서 클라이언트로 메세지를 보냅니다');
            }
        }, 3000);
    });
};*/
