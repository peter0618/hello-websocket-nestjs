// dom references
let gameRoomContainer = document.querySelector('#game-room-container');
let makeRoomButton = document.querySelector('#make-room-button');

makeRoomButton.addEventListener('click', onMakeRoomButtonClicked);

window.onload = async () => {
  const accessToken = localStorage.getItem('accessToken');
  const response = await fetch('/api/game-room', {
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

  const { data: gameRooms} = await response.json();
  gameRooms.forEach(gameRoom => {
    const { id, title, maxNumberOfGamers, numberOfGamers, user } = gameRoom;
    addGameRoomItem(id, title, user.nickName, `${numberOfGamers}/${maxNumberOfGamers}`);
  })
}

/**
 * 하나의 채팅방 리스트 아이템을 동적으로 생성합니다.
 * @param id
 * @param title
 * @param createdBy
 * @param memberRatio
 */
function addGameRoomItem(id, title, createdBy, memberRatio){
  const gameRoom = document.createElement('div');
  gameRoom.className = 'game-room';

  const roomNumber = document.createElement('div');
  roomNumber.textContent = id;
  roomNumber.className = 'room-number';

  const roomTitle = document.createElement('div');
  roomTitle.textContent = title;
  roomTitle.className = 'room-title';

  const roomHost = document.createElement('div');
  roomHost.textContent = createdBy;
  roomHost.className = 'room-host';

  const roomMemberCount = document.createElement('div');
  roomMemberCount.textContent = memberRatio;
  roomMemberCount.className = 'room-member-count';

  const joinButton = document.createElement('button');
  joinButton.textContent = '참여';
  joinButton.className = 'join-button';
  joinButton.addEventListener('click', (event) => {
    location.href=`/game-room?id=${id}`;
  })

  const borderLine = document.createElement('div');
  borderLine.style.width = 'auto';
  borderLine.style.height = '1px';
  borderLine.style.background = 'dodgerblue';
  borderLine.style.opacity = '0.3';

  gameRoom.append(roomNumber);
  gameRoom.append(roomTitle);
  gameRoom.append(roomHost);
  gameRoom.append(roomMemberCount);
  gameRoom.append(joinButton);

  gameRoomContainer.append(gameRoom);
  gameRoomContainer.append(borderLine);
}

function onMakeRoomButtonClicked() {
  window.open('make_room_popup.html', 'make game room','width=400, height=300, left=100, top=50');
}

/**
 * 팝업 창으로부터 방제목, 최대 인원수 정보를 받아와서 방생성 API 를 호출합니다.
 * 방생성이 호출하면 해당 방으로 입장해야 합니다.
 *
 * @param title
 * @param maxNumberOfGamers
 * @returns {Promise<void>}
 */
async function createRoom(title, maxNumberOfGamers) {
  const body = { title, maxNumberOfGamers };
  const accessToken = localStorage.getItem('accessToken');
  const response = await fetch('/api/game-room', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + accessToken
    },
    body: JSON.stringify(body)
  });

  const status = response.status;
  if(status === 401 || status === 403) {
    alert('로그인이 필요합니다.');
    localStorage.removeItem('accessToken');
    location.href='/login';
    return
  }
  if(!response.ok || status === 500){
    alert('방 만들기 요청이 실패하였습니다.');
    console.log(response);
    return;
  }

  const { data: { id } } = await response.json();
  location.href = `/game-room?id=${id}`;
}
