import {ADD_PLAN, DELETE_PLAN, EDIT_PLAN, FETCH_PLANS} from "./types";
import PlanService from "../../services/pair.service";
import {setMessage} from "./message";

export const fetchPlans = (params = {}) => dispatch => {
    return PlanService.fetchPlans(params)
        .then(
            ({plans, count}) => {
                dispatch({
                    type: FETCH_PLANS,
                    payload: {
                        plans,
                        count,
                    },
                });
                return Promise.resolve();
            },
            error => {
                const message =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                dispatch(setMessage({
                    message: message,
                    type: 'danger',
                    show: true,
                }));
                return Promise.reject();
            }
        );
}

export const addPlan = plan => dispatch => {
    return PlanService.addPlan(plan)
        .then(
            plan => {
                dispatch({
                    type: ADD_PLAN,
                    payload: {
                        plan,
                    }
                });
                dispatch(setMessage({
                    message: 'Plan added successfully',
                    type: 'success',
                    show: true,
                }));
                return Promise.resolve();
            },
            error => {
                const message =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                dispatch(setMessage({
                    message: message,
                    type: 'danger',
                    show: true,
                }));
                return Promise.reject();
            }
        );
};

export const editPlan = plan => dispatch => {
    return PlanService.editPlan(plan)
        .then(
            plan => {
                dispatch({
                    type: EDIT_PLAN,
                    payload: {
                        plan,
                    }
                });
                dispatch(setMessage({
                    message: 'Plan modified successfully',
                    type: 'success',
                    show: true,
                }));
                return Promise.resolve();
            },
            error => {
                const message =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                dispatch(setMessage({
                    message: message,
                    type: 'danger',
                    show: true,
                }));
                return Promise.reject();
            }
        );
};

export const deletePlan = id => dispatch => {
    return PlanService.deletePlan(id)
        .then(
            () => {
                dispatch({
                    type: DELETE_PLAN,
                    payload: {
                        id,
                    }
                });
                dispatch(setMessage({
                    message: 'Plan deleted successfully',
                    type: 'success',
                    show: true,
                }));
                return Promise.resolve();
            },
            error => {
                const message =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                dispatch(setMessage({
                    message: message,
                    type: 'danger',
                    show: true,
                }));
                return Promise.reject();
            }
        );
};
