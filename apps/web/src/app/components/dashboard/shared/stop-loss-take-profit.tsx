import {Popup} from "./popup";
import {Dispatch, FC, SetStateAction, useEffect, useState} from "react";

interface IProps {
  showFullName?: boolean;
  top?: number;
  left?: number;
  showButtons?: boolean;
  stopLoss: string;
  setStopLoss: Dispatch<SetStateAction<string>>;
  takeProfit: string;
  setTakeProfit: Dispatch<SetStateAction<string>>;
}

interface SlTpOptionsProps {
  showButtons?: boolean;
  setClosePopup: Dispatch<SetStateAction<boolean>>;
  stopLoss: string;
  setStopLoss: Dispatch<SetStateAction<string>>;
  takeProfit: string;
  setTakeProfit: Dispatch<SetStateAction<string>>;
}

interface SlTpProps {
  showFullName?: boolean;
  stopLoss: string;
  takeProfit: string;
}

const SlTp = (props: SlTpProps) => (
  <div className={'multiplier'}>
    <span>{props.showFullName ? 'Stop Loss / Take Profit' : 'SL / TP'}</span>
    <p className={'option'}>
      {props.stopLoss || '--'} / {props.takeProfit || '--'}
    </p>
  </div>
);

const SlTpOptions = (props: SlTpOptionsProps) => (
  <div className={'trade-options'}>
    <p>Stop Loss and Take Profit</p>
    <div className={'options-block'}>
      <div className={'sl-tp-option'}>
        <div className={'input'}>
          <span>Stop Loss</span>
          <div className={'input-field'}>
            <span>-</span>
            <input type={'number'} step={0.00000001} value={props.stopLoss}
                   onChange={e =>
                     props.setStopLoss(e.target.value)}/>
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
            <input type={'number'} step={0.00000001} value={props.takeProfit}
                   onChange={e =>
                     props.setTakeProfit(e.target.value)}/>
          </div>
        </div>
        <div className={'symbol'}>
          $
        </div>
      </div>
    </div>
    {props.showButtons && (
        <div className={"flex-row-space-between"} style={{gap: 4}}>
          <button className={"button bg-light-grey"} onClick={() => props.setClosePopup(true)}>
            Cancel
          </button>
          <button className={"button bg-primary"} onClick={() => props.setClosePopup(true)}>
            Save
          </button>
        </div>
    )}
  </div>
);

let timeoutID: NodeJS.Timeout;

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
    <Popup popupLauncher={<SlTp showFullName={props.showFullName} stopLoss={props.stopLoss} takeProfit={props.takeProfit}/>}
           popupContent={<SlTpOptions stopLoss={props.stopLoss} setStopLoss={props.setStopLoss}
                                      takeProfit={props.takeProfit} setTakeProfit={props.setTakeProfit}
                                      setClosePopup={setClosePopup} showButtons={props.showButtons}/>}
           left={props.left} top={props.top} closePopup={closePopup}/>
  );
};
