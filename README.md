## node.js 교과서 클론 및 스터디

* 웹소켓을 이용한 채팅 어플리케이션 클론

* 본 코드 및 내용은 ZeroCho 님의 저작물인 Node.js 교과서를 학습하는 과정에서 개인의 학습을 위해 작업한 Repo입니다.

### 웹 소켓이란?
- 웹소켓은 HTML5에 새로 추가된 스펙으로 실시간 양방향 데이터 전송을 위한 기술
- HTTP와 다르게 Ws라는 프로토콜을 사용하지만, 첫 연결은 HTTP 프로토콜을 통해 시작된다. 연결이 정상적으로 이뤄지면 Ws 프로토콜로 연결이 유지된다.
- 포트를 HTTP와 공유한다  
- 웹 소켓 연결이 이뤄지고 나면 서버와 클라이언트는 실시간으로 데이터 전송이 양방향으로 가능해진다
- ws, Socket.IO 와 같은 라이브러리를 이용해서 구현할 수 있다

### 장점
- 실시간 데이터의 빠른 전송이 필요한 (ex:주식앱) 경우에 좋다
- header가 상당히 작아 overhead가 적은 특징이 있다(HTTP는 헤더가 kByte 단위, WS는 Byte단위로 네트워크 과부하가 줄어든다)
- 많은 수의 동시 접속자 수용이 가능하다
- 브라우저에서 TCP 기반의 통신으로 확장할 수 있다

### 단점
- 코드의 복잡도가 증가( 연결이 끊어지거나 하는 경우에 대한 고려 )
- 다량의 통신을 유지하는 것은 CPU에도 부담이 된다
- HTML5를 완전히 지원하지 않는 구버전 브라우저에서는 작동을 보장하지 않는다.


### 핵심 정리
- 웹 소켓과 HTTP는 같은 포트를 사용할 수 있으므로 따로 포트를 설정할 필요가 없습니다.
- 웹 소켓은 양방향 통신이므로 서버뿐만 아니라 프런트엔드 쪽 스크립도 사용해야 한다.
- Socket.IO 를 사용하면 웹 소켓을 지원하지 않는 브라우저에서까지 실시간 통신을 구현할 수 있다.
- Socket.IO 네임스페이스와 방 구분을 통해 실시간 데이터를 필요한 사용자에게만 보낼 수 있다.
- app.set('io', io)로 소켓 객체를 익스프레스와 연결하고, req.app.get('io')로 라우터에서 소켓 객체를 가져오는 방식을 기억하자.
- 소켓 통신과 함께 데이터베이스 조작이 필요한 경우, 소켓만으로 해결하기 보다는 HTTP 라우터를 거치는 것이 좋다.

#### 추가 기능 구현해보기 
- 채팅방에 현재 참여자 수나 목록 표시하기
- 시스템 메시지까지 DB에 저장하기 (입, 퇴장 기록)
- 채팅방에서 한 사람에게 귓속말 보내기 ( 화면 만들고 socket.to(소켓 아이디) 메서드 사용)
- 방장 기능 구현하기(방에 방장 정보를 저장한 후 방장이 나갔을 때는 방장 위임 기능 추가)
- 강퇴 기능 구현(강퇴 소켓 이벤트 추가)
