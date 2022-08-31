import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus } from "@nestjs/common";
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError'
import { Response } from 'express';

@Catch(EntityNotFoundError)
export class EntityNotFoundExceptionFilter implements ExceptionFilter {
  public catch(exception: EntityNotFoundError, host: ArgumentsHost) {

    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    return response.status(HttpStatus.NOT_FOUND)
      .json({
        message: { 
          statusCode: HttpStatus.NOT_FOUND, 
          error: 'Not Found', 
          message: exception.message
        } 
      });
  }
}