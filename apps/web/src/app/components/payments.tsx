import React, {FC} from 'react';
import '../styles/Sidebar.css';

interface IProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const Payments: FC<IProps> = (props) => {
  return (
    <div className={`sidebar ${props.isOpen ? 'open' : ''}`}>
      <div>
        <div className={"flex-row-space-between close-button"}>
          <div/>
          <i className="fa-solid fa-xmark cursor-pointer"
             onClick={props.toggleSidebar}></i>
        </div>
        <div className={"flex-column"} style={{gap: "1rem"}}>
          <div className={"sidebar-option"} style={{ padding: "24px 16px" }}>
            <i className="fa-solid fa-wallet"></i>
            <div className={"info"}>
              <h5>Deposit</h5>
            </div>
          </div>
          <div className={"sidebar-option"} style={{ padding: "24px 16px" }}>
            <i className="fa-solid fa-money-bill"></i>
            <div className={"info"}>
              <h5>Withdraw</h5>
            </div>
          </div>
          <div className={"sidebar-option"} style={{ padding: "24px 16px" }}>
            <i className="fa-solid fa-clock-rotate-left"></i>
            <div className={"info"}>
              <h5>Transactions</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
