import React, {FC} from 'react';
import '../../styles/Sidebar.css';
import {Modals} from "@coinvant/types";

interface IProps {
  activeModal: Modals | null;
  openModal: (payload: Modals) => void;
  closeModal: () => void;
}

export const Payments: FC<IProps> = (props) => {
  return (
    <div className={`sidebar ${props.activeModal === Modals.payments ? 'open' : ''}`}>
      <div>
        <div className={"flex-row-space-between close-button"}>
          <div/>
          <i className="fa-solid fa-xmark cursor-pointer"
             onClick={props.closeModal}></i>
        </div>
        <div className={"flex-column"} style={{gap: "1rem"}}>
          <div className={"sidebar-option"} onClick={() => props.openModal(Modals.deposit)}
               style={{ padding: "24px 16px", backgroundColor: "rgba(0, 148, 255, 1)" }}>
            <i className="fa-solid fa-wallet"></i>
            <div className={"info"}>
              <h5>Deposit</h5>
            </div>
          </div>
          <div className={"sidebar-option"} onClick={() => props.openModal(Modals.withdrawal)}
               style={{ padding: "24px 16px" }}>
            <i className="fa-solid fa-hand-holding-dollar"></i>
            <div className={"info"}>
            <h5>Withdraw</h5>
            </div>
          </div>
          <div className={"sidebar-option"} onClick={() => props.openModal(Modals.transactions)}
               style={{ padding: "24px 16px" }}>
            <i className="fa-solid fa-arrow-right-arrow-left"></i>
            <div className={"info"}>
              <h5>Transactions</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
