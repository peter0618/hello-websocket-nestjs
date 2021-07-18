// dom reference
const loginButton = document.getElementById('login-button');
const signupButton = document.getElementById('signup-button');
const useridDom = document.getElementById('userid');
const passwordDom = document.getElementById('password');


loginButton.addEventListener('click', onLoginButtonClicked);
passwordDom.onkeydown = async (event) => {
  if(event.code === 'Enter') {
    await onLoginButtonClicked(event);
  }
}

signupButton.addEventListener('click', (event) => {
  // 클릭 이벤트 발생시 처리되는 기본동작을 막음
  event.preventDefault();
  location.href='/signup';
})

/**
 * 서버에 로그인 처리를 요청합니다.
 * 로그인 버튼 클릭 (또는 패스워드 입력 후 엔터 입력 시) 시 호출됩니다.
 * @param event
 * @returns {Promise<void>}
 */
async function onLoginButtonClicked(event) {
  // 클릭 이벤트 발생시 처리되는 기본동작을 막음
  event.preventDefault();
  const loginId = useridDom.value;
  const password = passwordDom.value;

  const response = await fetch('/auth/login', {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ loginId, password })
  })

  const { success, token } = await response.json();
  if (!(response.ok || success)) {
    return alert('로그인 실패!!');
  }

  localStorage.setItem('accessToken', token);
  location.href='/chatroom';
}

/**
 * 토큰의 유효성 검증이 통과되면 /chatroom 으로 redirect 합니다.
 */
checkAccessToken().then((isTokenValid) => {
  if (isTokenValid){
    return location.href='/chatroom';
  }
  document.querySelector('#container').style.display = 'block';
});

/**
 * 토큰 존재유무 및 유효성 여부를 확인합니다.
 * 토큰이 존재하지 않거나 유효하지 않으면 false 를 리턴합니다. (유효하지 않으면 지워버립니다.)
 */
async function checkAccessToken() {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken){
    return false;
  }
  const response = await fetch('/auth/token-validation', {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ token: accessToken })
  });

  const { success, payload } = await response.json();
  // console.log(response);
  // console.log(success);
  if (!response.ok || !success) {
    localStorage.removeItem('accessToken');
    return false;
  }
  // console.log(payload);
  return true;
}
