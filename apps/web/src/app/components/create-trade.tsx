import '../styles/CreateTrade.css';
import {Popup} from "./shared/popup";
import {FC, useState} from "react";
import {StopLossTakeProfitOptions} from "./shared/stop-los-take-profit";

interface IProps {
  toggleSidebar: (component: 'payments' | 'settings') => void;
}

const Multiplier = () => (
  <div className={'multiplier'}>
    <span>Multiplier</span>
    <p className={'option'}>
      <span className={'x-sign'}>x</span>500
    </p>
  </div>
);

const EnableOrders = () => (
  <div className={'enable-orders'}>
    <span>Enable Orders</span>
    <i className="fa-solid fa-clock"></i>
  </div>
)

const MultiplierOptions = () => (
  <div className={'trade-options'}>
    <p>Multiplier</p>
    <div className={'options-block'}>
      <div className={'options'}>
        <div className={'option'}>
          <span className={'x-sign'}>x</span>50
        </div>
        <div className={'option'}>
          <span className={'x-sign'}>x</span>100
        </div>
      </div>
      <div className={'options'}>
        <div className={'option'}>
          <span className={'x-sign'}>x</span>200
        </div>
        <div className={'option active'}>
          <span className={'x-sign'}>x</span>500
        </div>
      </div>
    </div>
  </div>
);

const EnableOrdersOptions = () => {
  const [activeTab, setActiveTab] = useState<'bp' | 'bt'>('bp');
  return (
    <div className={'trade-options'}>
      <p>Order Details</p>
      <div className="tabs">
        <button className={`${activeTab === 'bp' && 'active'}`}
                onClick={() => setActiveTab('bp')}>By Price
        </button>
        <button className={`${activeTab === 'bt' && 'active'}`}
                onClick={() => setActiveTab('bt')}>By Time
        </button>
      </div>
      <div className={'sl-tp-option'}>
        <div className={'input'}>
          <span>Profitability</span>
          <div className={'input-field'}>
            <select>
              <option>Any</option>
              <option>from 70%</option>
              <option>from 80%</option>
              <option>from 90%</option>
            </select>
          </div>
        </div>
      </div>
      <div className={'sl-tp-option'}>
        {activeTab === 'bp' && (
          <div className={'input'}>
            <span>Opening Price</span>
            <div className={'input-field'}>
              <input type={'number'} step={0.00000001}/>
            </div>
          </div>
        )}
        {activeTab === 'bt' && (
          <div className={'input'}>
            <span>Opening Time</span>
            <div className={'input-field'}>
              <input type={'time'}/>
            </div>
          </div>
        )}
      </div>
      <button className={"save"}>Save</button>
    </div>
  );
};

export const CreateTrade: FC<IProps> = (props) => {
  return (
    <div className="create-trade">
      <div className={'top-buttons'}>
        <button onClick={() => props.toggleSidebar('payments')}>Payments</button>
        <div className={"cursor-pointer"}
             onClick={() => props.toggleSidebar('settings')}>
          <i className="fa-solid fa-user"></i>
        </div>
      </div>
      <div>
        <div className={'amount-input'}>
          <span>Amount, $</span>
          <input type={'number'} placeholder={'0'}/>
        </div>
        <div className={'amount-change'}>
          <div className={'subtract'}>-</div>
          <div style={{backgroundColor: "rgba(14, 15, 18, 1)", flex: 0.1}}/>
          <div className={'add'}>+</div>
        </div>
      </div>
      <Popup popupLauncher={<Multiplier/>} popupContent={<MultiplierOptions/>}/>
      <StopLossTakeProfitOptions/>
      <Popup popupLauncher={<EnableOrders/>} popupContent={<EnableOrdersOptions/>} top={-75}/>
      <div className={'order-buttons'}>
        <button className={'bg-positive'}>
          <span>Up</span>
          <i className="fa-solid fa-arrow-up"></i>
        </button>
        <button className={'bg-negative'}>
          <span>Down</span>
          <i className="fa-solid fa-arrow-down"></i>
        </button>
      </div>
    </div>
  );
};
