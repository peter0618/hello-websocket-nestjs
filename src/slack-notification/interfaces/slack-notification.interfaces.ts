/**
 * 슬랙 웹훅 전송 응답 interface
 */
export interface SlackWebhookResponse {
  /**
   * 전송상태
   */
  status: string;

  /**
   * 전송상태 코드
   */
  statusCode: number;

  /**
   * 헤더정보 객체
   */
  headers: any;

  /**
   * ??
   */
  response: string;
}
