import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';

/**
 * Exception 필터
 *
 * Exception 발생 시 정해진 format 으로 반환 시킵니다.
 * TODO : HttpException 이 아닌 일반적인 Error 도 cover 하기 위한 고도화가 필요합니다.
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger: Logger = new Logger(this.constructor.name);
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const status = exception.getStatus();

    // default message
    let message = exception.message;

    // set message for validation failure
    // fixme : class-validator 에 의해 throw 되는 error 는 아래와 같이 처리됩니다.
    //  하지만, 임의로 throw HttpException('메시지', HttpStatus.BAD_REQUEST) 하면, 아래 로직이 제대로 실행되지 않습니다.
    if (status === HttpStatus.BAD_REQUEST) {
      const exceptionResponse = exception.getResponse() as any;
      message = exceptionResponse.message;
    }

    this.logger.error(message);

    response.status(status).json({
      success: false,
      error: {
        message,
      },
    });
  }
}
