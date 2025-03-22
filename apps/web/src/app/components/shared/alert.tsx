import React, {useEffect} from 'react';
import '../../styles/Alert.css';
import {connect} from "react-redux";
import {AlertState} from "@coinvant/types";
import {hideAlert, RootState} from "@coinvant/store";

interface IProps {
  alert: AlertState;
  hideAlert: () => void;
}

const mapStateToProps = (state: RootState) => {
  return {
    alert: state.alert,
  }
}

const actions = { hideAlert };

export const Alert = connect(mapStateToProps, actions)((props: IProps) => {
  if (!props.alert.show) {
    return null;
  }

  useEffect(() => {
    if (props.alert.show) {
      const timer = setTimeout(() => {
        props.hideAlert();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [props, props.alert.show]);

  return (
    <div className={`alert-container show`}>
      <div className={`alert ${props.alert.type === 'success' ? 'bg-positive' : 'bg-negative'}`}>
        <button className="close-btn" onClick={() => props.hideAlert()}>
          &times;
        </button>
        <div className="alert-body">{props.alert.message}</div>
      </div>
    </div>
  );
});
