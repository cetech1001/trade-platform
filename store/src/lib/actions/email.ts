import { SupportEmailPayload } from '@coinvant/types';
import { AppDispatch, showAlert } from '../../index';
import { EmailService } from '../services';

export const sendSupportEmail = (payload: SupportEmailPayload) => async (dispatch: AppDispatch) => {
  try {
    await EmailService.sendSupportEmail(payload);
    dispatch(showAlert({
      type: 'success',
      show: true,
      message: 'Support ticket created successfully',
    }));
  } catch (error) {
    dispatch(showAlert({
      type: 'error',
      show: true,
      message: 'Failed to send message',
    }));
  }
}
