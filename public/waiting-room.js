// dom references
let gameRoomContainer = document.querySelector('#game-room-container');

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
    return
  }

  const gameRooms = await response.json();
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
  roomNumber.innerText = id;
  roomNumber.className = 'room-number';

  const roomTitle = document.createElement('div');
  roomTitle.innerText = title;
  roomTitle.className = 'room-title';

  const roomHost = document.createElement('div');
  roomHost.innerText = createdBy;
  roomHost.className = 'room-host';

  const roomMemberCount = document.createElement('div');
  roomMemberCount.innerText = memberRatio;
  roomMemberCount.className = 'room-member-count';

  const joinButton = document.createElement('button');
  joinButton.innerText = '참여';
  joinButton.className = 'join-button';
  joinButton.addEventListener('click', (event) => {
    console.log(`${id}!! clicked!!`);
    // TODO : "참여버튼" 클릭시 채팅방으로 입장하는 로직 구현이 필요합니다.
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

