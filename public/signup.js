// dom reference
const nameDom = document.querySelector('#name');
const nickNameDom = document.querySelector('#nickName');
const useridDom = document.querySelector('#userid');
const passwordDom = document.querySelector('#password');
const emailDom = document.querySelector('#email');
const signupButton = document.querySelector('#signup-button');

signupButton.addEventListener('click', onSignupButtonClicked);
emailDom.onkeydown = async (event) => {
  if(event.code === 'Enter') {
    await onSignupButtonClicked(event);
  }
}

async function onSignupButtonClicked(event) {
  // 클릭 이벤트 발생시 처리되는 기본동작을 막음
  event.preventDefault();

  const name = nameDom.value;
  const nickName = nickNameDom.value;
  const userid = useridDom.value;
  const password = passwordDom.value;
  const email = emailDom.value;

  // fixme : 서버에 회원가입 요청 전에 프론트엔드 단에서
  //  input 필드에 대한 validation check 로직을 수행해야 합니다.
  const response = await fetch('/auth/signup', {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ name, nickName, loginId: userid, password, email})
  });

  const statusCode = response.status
  // 201 은 성공. 나머지(400: validation error, 406: 이미 사용중인 로그인 아이디 ) 는 실패
  if (statusCode === 201) {
    alert('축하드립니다. 회원가입에 성공하셨습니다!\n가입하신 접속정보로 로그인하세요^^');
    location.href='/login'
    return;
  }

  // 에러 메시지 노출
  if (statusCode === 400) {
    alert('입력된 정보가 유효하지 않습니다.\n아직 입력되지 않은 정보는 없는지 확인해보세요.');
    return;
  }
  const {message} = await response.json();
  alert(message);
}

