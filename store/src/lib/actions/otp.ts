import { AppDispatch, showAlert } from '../../index';
import { OTPService } from '../services';
import { getError } from '../helpers';

export const sendOTP = () => async (dispatch: AppDispatch) => {
  try {
    await OTPService.sendOTP();
    dispatch(showAlert({
      show: true,
      type: 'success',
      message: 'OTP sent successfully',
    }));
  } catch (error) {
    dispatch(showAlert({
      show: true,
      type: 'error',
      message: 'Failed to send OTP.',
    }));
  }
}

export const verifyOTP = (otp: string) => async (dispatch: AppDispatch) => {
  try {
    return await OTPService.verifyOTP(otp);
  } catch (error) {
    const { message } = getError(error);
    dispatch(showAlert({
      show: true,
      type: 'error',
      message: message,
    }));
    return false;
  }
}
