import { FailureLog, IFailureLog } from '@/models/FailureLog';
import { CreateFailureLogDto } from '@/types/dtos/failureLogDto';

class FailureLogService {
  async createFailureLog(failureLogData: CreateFailureLogDto): Promise<IFailureLog> {
    try {
      const failureLog = new FailureLog(failureLogData);
      return await failureLog.save();
    } catch (error: any) {
      throw new Error(`Failed to create failure log: ${error.message}`);
    }
  }
}

export default new FailureLogService();
