// EventType enum 선언
let EventType;
(function (EventType) {
  EventType["CHAT"] = "CHAT";
  EventType["SAY_HI"] = "SAY_HI";
  EventType["SAY_BYE"] = "SAY_BYE";
})(EventType || (EventType = {}));

// const variables
const SAY_HI_MESSAGE_COLOR = 'blue';
const SAY_BYE_MESSAGE_COLOR = 'orange';
const MY_CHAT_MESSAGE_COLOR = 'red';
const ATTENDANTS_COLOR = 'blue';

// dom reference 매핑
const messageDom = document.getElementById('message');
const chatList = document.getElementById('chatList');
const sendMessageButton = document.getElementById("btn_send");
const chatListContainer = document.getElementsByClassName('chat-list-container')[0];
const attendantsList = document.getElementById('attendants-list');

let myNickName = null;
let myId = null;
let socket = null;
let roomId = null;



window.onload = async () => {
  const { id } = getUrlParams();
  // url 파라미터에 id 가 없으면 대기실로 돌아갑니다.
  if (!id) {
    location.href='/waiting-room';
  }
  roomId = id;
  const accessToken = localStorage.getItem('accessToken');
  const response = await fetch(`/api/game-room/${id}`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + accessToken
    },
  });

  const status = response.status;
  if(status === 401 || status === 403) {
    alert('로그인이 필요합니다.');
    localStorage.removeItem('accessToken');
    location.href='/login';
    return;
  }

  const {data: gameRoom} = await response.json();

  if (gameRoom === null) {
    alert('해당 채팅방이 존재하지 않습니다.');
    location.href='/waiting-room';
    return;
  }

  const { maxNumberOfGamers, numberOfGamers, title, user: roomOwner} = gameRoom;
  if (maxNumberOfGamers <= numberOfGamers) {
    alert('인원이 꽉 찼습니다.');
    location.href='/waiting-room';
    return;
  }

  const responseOfMe = await fetch(`/api/me`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + accessToken
    },
  });

  const { data: me } = await responseOfMe.json();
  myNickName = me.nickName;
  myId = me.id;

  main();
}

function main(){
  console.log('main()!!!');

  // 소켓 클라이언트 객체 생성
  socket = io.connect(`http://${chatServerIP}:8080`);

  socket.on('connect', () => {
    console.log(`소켓 연결 성공(id: ${socket.id})`);
    socket.emit(EventType.SAY_HI, { nickName: myNickName, roomId });
  });

  socket.on(EventType.SAY_HI, function(data){
    const { nickName, attendants, datetime } = data;
    addNoticeMessage(SAY_HI_MESSAGE_COLOR, `[${fromISOtoLocalTime(datetime)}] ${nickName} 님이 입장하셨습니다.`);
    refreshAttendantsList(attendants);
  });

  socket.on(EventType.SAY_BYE , function(data) {
    const { nickName, attendants, datetime } = data;
    addNoticeMessage(SAY_BYE_MESSAGE_COLOR, `[${fromISOtoLocalTime(datetime)}] ${nickName} 님이 퇴장하셨습니다.`);
    refreshAttendantsList(attendants);
  });

  socket.on(EventType.CHAT, function(data) {
    const {text, nickName, datetime} = data;
    const div = document.createElement('div');
    div.textContent = `[${fromISOtoLocalTime(datetime)}] ${nickName} : ${text}`;
    chatList.append(div);
    // 최근 채팅이 맨 아래에 위치하도록 스크롤
    chatListContainer.scrollTo(0, chatListContainer.scrollHeight);
  });

  // '메시지 전송' 버튼 클릭 OR 엔터 key 입력 시 onSendMessage() 메소드 호출
  sendMessageButton.onclick = onSendMessage;
  messageDom.onkeydown = (event) => {
    // 한글 맨 뒤 한글자 더 입력되는 부분을 처리하기 위해 isComposing === false 조건 추가
    if(event.code === 'Enter' && event.isComposing === false) {
      onSendMessage();
    }
  }
}

/**
 * url 의 query parameter 를 parsing 하여 object 로 리턴합니다.
 * @returns {{}}
 */
function getUrlParams() {
  return location.search
    .substring(1)
    .split('&')
    .reduce((acc, cur) => {
        [key, value] = cur.split('=');
        acc[key] = value;
        return acc;
      }, {});
}

/**
 * 입력한 메시지를 내 채팅창에도 노출시키고 상대방의 채팅창에 노출되도록 메시지를 소켓으로 전송합니다.
 */
function onSendMessage() {
  let text = messageDom.value;

  const now = new Date();
  const [ timeString ] = now.toTimeString().split(' '); // toTimeString 은 로컬 타임으로 표시하기 때문에 이대로 채팅화면에 표시하면 됩니다.

  const div = document.createElement('div');
  div.style.color = MY_CHAT_MESSAGE_COLOR;
  div.textContent = `[${timeString}] ${myNickName}(나) : ${text}`
  chatList.append(div);
  // 최근 채팅이 맨 아래에 위치하도록 스크롤
  chatListContainer.scrollTo(0, chatListContainer.scrollHeight);

  socket.emit(EventType.CHAT, { roomId, nickName: myNickName, text, datetime: now.toISOString() }); // 서버에 전달할 때는 iso 규격으로 전달합니다.

  messageDom.value = '';
}

/**
 * 참여자 목록 새로고침
 */
function refreshAttendantsList(attendants) {
  attendantsList.innerHTML = '';
  attendants.forEach((attendant) => {
    const div = document.createElement('div');
    div.style.color = ATTENDANTS_COLOR;
    div.textContent = attendant;
    attendantsList.append(div);
  });
}

/**
 * 채팅창에 공지 메시지 노출
 * @param messageColor
 * @param message
 */
function addNoticeMessage(messageColor, message) {
  const div = document.createElement('div');
  div.style.color = messageColor;
  div.textContent = message;
  chatList.append(div);
  // 최근 채팅이 맨 아래에 위치하도록 스크롤
  chatListContainer.scrollTo(0, chatListContainer.scrollHeight);
}

/**
 * ISO 시간을 로컬 시간으로 변환합니다.
 * 예) 2021-09-28T17:06:40.715Z -> 02:06:40 (한국 기준)
 * @param datetime
 * @returns {string}
 */
function fromISOtoLocalTime(datetime) {
  const [ localTime ] = new Date(datetime).toTimeString().split(' ');
  return localTime;
}
