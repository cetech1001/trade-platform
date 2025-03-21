import { AppDispatch, showAlert } from '../../index';
import { OTPService } from '../services';
import { getError } from '../helpers';
import { VerifyOTP } from '@coinvant/types';

export const sendOTP = (email: string) => async (dispatch: AppDispatch) => {
  try {
    await OTPService.sendOTP(email);
    dispatch(showAlert({
      show: true,
      type: 'success',
      message: 'OTP sent successfully',
    }));
  } catch (error) {
    const { message } = getError(error);
    dispatch(showAlert({
      show: true,
      type: 'error',
      message: message || 'Failed to send OTP.',
    }));
    return Promise.reject(message);
  }
}

export const verifyOTP = (payload: VerifyOTP) => async (dispatch: AppDispatch) => {
  try {
    return await OTPService.verifyOTP(payload);
  } catch (error) {
    const { message } = getError(error);
    dispatch(showAlert({
      show: true,
      type: 'error',
      message: message,
    }));
    return Promise.reject(message);
  }
}
