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