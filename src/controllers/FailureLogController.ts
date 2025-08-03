import { Request, Response, NextFunction } from 'express';
import FailureLogService from '@/services/FailureLogService';
import { CreateFailureLogDto } from '@/types/dtos/failureLogDto';
import { RESPONSE_MESSAGES } from '@/utils/constants';
import ResponseHandler from '@/utils/responseHandler';

//TODO: method should go to interfaces and then it should be implemented in the service/controller
class FailureLogController {
  async createFailureLog(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const failureLogData: CreateFailureLogDto = req.body;

      //TODO: Add validation for the failureLogData

      const failureLog = await FailureLogService.createFailureLog(failureLogData);

      ResponseHandler.created(res, failureLog, RESPONSE_MESSAGES.CREATED);
    } catch (error) {
      next(error);
    }
  }
}

export default new FailureLogController(); 