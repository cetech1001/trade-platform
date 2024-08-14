import React, {useEffect} from 'react';
import { Toast, Button } from 'react-bootstrap';
import {connect} from "react-redux";
import {hideAlert, RootState} from "@coinvant/store";
import {AlertState} from "@coinvant/types";
import ToastContainer from "react-bootstrap/ToastContainer"

interface IProps {
  alert: AlertState;
  hideAlert: () => void;
}

export const Alert = connect(
  (state: RootState) => ({
    alert: state.alert,
  }),
  { hideAlert }
)((props: IProps) => {
  useEffect(() => {
    if (props.alert.show) {
      const timer = setTimeout(() => {
        props.hideAlert();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [props.alert.show]);

  return (
      <ToastContainer position="top-center">
          <Toast show={props.alert.show} onClose={props.hideAlert}
                 className={`my-3 bg-${props.alert.type === 'error' ? 'danger' : 'success'}`}>
              <Toast.Header className={`text-${props.alert.type === 'error' ? 'danger' : 'success'}`}
                            closeButton={false}>
                  <strong className="me-auto ms-2">{props.alert.type}</strong>
                  <small>Just Now</small>
                  <Button variant="close" size="sm" onClick={props.hideAlert} />
              </Toast.Header>
              <Toast.Body>
                  {props.alert.message}
              </Toast.Body>
          </Toast>
      </ToastContainer>
  );
})
