// dom references
let gameRoomContainer = document.querySelector('#game-room-container');

// fixme : 서버로부터 실제 데이터를 조회하여 해당 아이템들을 동적으로 생성하도록 로직을 변경해야 합니다.
addGameRoomItem(1, '초성게임 고수 환영', 'Peter', '4/4');
addGameRoomItem(2, '초성게임 새벽반 @@', 'Koo', '2/3');
addGameRoomItem(3, '아무나 오시게~~', 'Yobs', '6/10');
addGameRoomItem(4, '초성게임 제발 초보만요 ㅠㅠ', 'Kate', '2/5');

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

