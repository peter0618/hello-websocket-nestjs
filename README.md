<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## Description

웹소켓을 이용한 채팅 프로그램 toy project 입니다.

## Installation

```bash
$ yarn install
```

## env variables
```
CHAT_SERVER_IP=127.0.0.1
JWT_SECRET=secretkey
JWT_EXPIRES_IN=14d
APP_PORT=3000
```
project root 폴더에 `.env` 파일을 생성하여 위 예시와 같이 환경변수를 선언합니다.

## Running the app

```bash
# development
$ yarn start:dev

# production mode
$ yarn start:prod
```

## License

Nest is [MIT licensed](LICENSE).
