import {Popup} from "./popup";
import {Dispatch, FC, SetStateAction, useEffect, useState} from "react";

interface IProps {
  fullName?: boolean;
  top?: number;
  left?: number;
}

interface SlTpOptionsProps {
  setClosePopup: Dispatch<SetStateAction<boolean>>;
}

const SlTp: FC<IProps> = (props) => (
  <div className={'multiplier'}>
    <span>{props.fullName ? 'Stop Loss / Take Profit' : 'SL / TP'}</span>
    <p className={'option'}>
      -- / --
    </p>
  </div>
);

const SlTpOptions: FC<SlTpOptionsProps> = (props) => (
  <div className={'trade-options'}>
    <p>Stop Loss and Take Profit</p>
    <div className={'options-block'}>
      <div className={'sl-tp-option'}>
        <div className={'input'}>
          <span>Stop Loss</span>
          <div className={'input-field'}>
            <span>-</span>
            <input type={'number'} step={0.00000001}/>
          </div>
        </div>
        <div className={'symbol'}>
          $
        </div>
      </div>
      <div className={'sl-tp-option'}>
        <div className={'input'}>
          <span>Take Profit</span>
          <div className={'input-field'}>
            <span>+</span>
            <input type={'number'} step={0.00000001}/>
          </div>
        </div>
        <div className={'symbol'}>
          $
        </div>
      </div>
    </div>
    <div className={"flex-row-space-between"} style={{ gap: 4 }}>
      <button className={"button bg-light-grey"} onClick={() => props.setClosePopup(true)}>
        Cancel
      </button>
      <button className={"button bg-primary"} onClick={() => props.setClosePopup(true)}>
        Save
      </button>
    </div>
  </div>
);

let timeoutID:  NodeJS.Timeout;

export const StopLossTakeProfitOptions: FC<IProps> = (props) => {
  const [closePopup, setClosePopup] = useState(false);

  useEffect(() => {
    if (closePopup) {
      timeoutID = setTimeout(() => {
        setClosePopup(false);
      }, 500);
    }
    return () => clearTimeout(timeoutID);
  }, [closePopup]);

  return (
    <Popup popupLauncher={<SlTp fullName={props.fullName}/>}
           popupContent={<SlTpOptions setClosePopup={setClosePopup}/>}
           left={props.left} top={props.top} closePopup={closePopup}/>
  );
};
