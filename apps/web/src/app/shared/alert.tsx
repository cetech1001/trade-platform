import React, {useEffect, FC} from 'react';
import './styles/Alert.css';
import {AppDispatch, RootState} from "../../store";
import {connect} from "react-redux";
import {AlertState} from "@coinvant/types";
import {hideAlert} from "../../store";

interface IProps {
  alert: AlertState;
  dispatch: AppDispatch;
}

const Alert: FC<IProps> = (props) => {
  useEffect(() => {
    if (props.alert.show) {
      const timer = setTimeout(() => {
        props.dispatch(hideAlert());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [props.alert.show]);

  return (
    <div className={`alert-container ${props.alert.show ? 'show' : ''}`}>
      <div className={`alert ${props.alert.type === 'success' ? 'bg-positive' : 'bg-negative'}`}>
        <button className="close-btn" onClick={() => props.dispatch(hideAlert())}>
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

export default connect(mapStateToProps)(Alert);
