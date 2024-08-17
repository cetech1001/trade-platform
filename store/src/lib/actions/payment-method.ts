import {AppDispatch, showAlert} from "@coinvant/store";
import {PaymentMethodService} from "../services";
import {PaymentMethodActions} from "../types";
import {CreatePaymentMethod, PaginationOptions, UpdatePaymentMethod, PaymentMethod} from "@coinvant/types";

export const fetchPaymentMethods = (options?: PaginationOptions) => async (dispatch: AppDispatch) => {
	try {
		const data = await PaymentMethodService.getPaymentMethods(options);
		dispatch({
			type: PaymentMethodActions.LIST,
			payload: {
				list: data.items,
				count: data.meta.totalItems,
			},
		});
	} catch (error) {
		dispatch(showAlert({
			message: 'Failed to fetch payment methods.',
			type: 'error',
			show: true,
		}));
	}
}

export const addPaymentMethod = (payload: CreatePaymentMethod) => async (dispatch: AppDispatch) => {
	try {
		const data = await PaymentMethodService.createPaymentMethod(payload);
		dispatch({
			type: PaymentMethodActions.CREATE,
			payload: {
				currentPaymentMethod: data,
			},
		});
		dispatch(showAlert({
			message: 'Payment method created successfully.',
			type: 'success',
			show: true,
		}));
	} catch (error) {
		dispatch(showAlert({
			message: 'Failed to create payment method.',
			type: 'error',
			show: true,
		}));
	}
}

export const editPaymentMethod = (id: string, payload: UpdatePaymentMethod) => async (dispatch: AppDispatch) => {
	try {
		const data = await PaymentMethodService.updatePaymentMethod(id, payload);
		dispatch({
			type: PaymentMethodActions.UPDATE,
			payload: {
				currentPaymentMethod: data,
			},
		});
		dispatch(showAlert({
			message: 'Payment method updated successfully.',
			type: 'success',
			show: true,
		}));
	} catch (error) {
		dispatch(showAlert({
			message: 'Failed to update payment method.',
			type: 'error',
			show: true,
		}));
	}
}

export const removePaymentMethod = (id: string) => async (dispatch: AppDispatch) => {
	try {
		await PaymentMethodService.deletePaymentMethod(id);
		dispatch({
			type: PaymentMethodActions.DELETE,
		});
		dispatch(showAlert({
			message: 'Payment method deleted successfully.',
			type: 'success',
			show: true,
		}));
	} catch (error) {
		dispatch(showAlert({
			message: 'Failed to delete payment method.',
			type: 'error',
			show: true,
		}));
	}
}

export const setCurrentPaymentMethod = (paymentMethod: PaymentMethod) => async (dispatch: AppDispatch) => {
	dispatch({
		type: PaymentMethodActions.SET_CURRENT_PAYMENT_METHOD,
		payload: { currentPaymentMethod: paymentMethod },
	});
}
