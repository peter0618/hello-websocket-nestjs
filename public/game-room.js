


// TODO : 최초 실행 시, 해당 game-room 정보를 조회합니다.
//  token validation 이 통과되지 않으면 로그인 화면으로 이동.
//  해당 room 이 존재하지 않으면 waiting-room 으로 돌아감.
//  헤딩 room 은 존재하지만 인원수가 꽉 찼을 때, waiting-room 으로 돌아감.

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
