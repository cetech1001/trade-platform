import React, {useEffect, FC} from 'react';
import './styles/Alert.css';
import {AppDispatch, RootState} from "../../store";
import {connect} from "react-redux";
import {AlertState} from "@coinvant/types";
import {hideAlert} from "../../store";

interface IProps {
  alert: AlertState;
  hideAlert: () => void;
}

const Component: FC<IProps> = (props) => {
  useEffect(() => {
    if (props.alert.show) {
      const timer = setTimeout(() => {
        props.hideAlert();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [props.alert.show]);

  return (
    <div className={`alert-container ${props.alert.show ? 'show' : ''}`}>
      <div className={`alert ${props.alert.type === 'success' ? 'bg-positive' : 'bg-negative'}`}>
        <button className="close-btn" onClick={() => props.hideAlert()}>
          &times;
        </button>
        <div className="alert-body">{props.alert.message}</div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    alert: state.alert,
  }
}

export const Alert = connect(mapStateToProps, { hideAlert })(Component);
