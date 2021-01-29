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
};