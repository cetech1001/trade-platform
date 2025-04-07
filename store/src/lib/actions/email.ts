import { SupportEmailPayload } from '@coinvant/types';
import { AppDispatch, showAlert } from '../../index';
import { EmailService } from '../services';
import { getError } from '../helpers';

export const sendSupportEmail = (payload: SupportEmailPayload) => async (dispatch: AppDispatch) => {
  try {
    await EmailService.sendSupportEmail(payload);
    dispatch(showAlert({
      type: 'success',
      show: true,
      message: 'Support ticket created successfully',
    }));
  } catch (error) {
    const { message } = getError(error);
    dispatch(showAlert({
      type: 'error',
      show: true,
      message: message || 'Failed to send message',
    }));
  }
}
