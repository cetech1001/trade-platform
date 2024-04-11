import {FC, useMemo, useRef, useState} from "react";
import {Link} from "react-router-dom";
import {Dropdown} from "./shared/dropdown";
import '../styles/Assets.css';
import {FilterDropdown} from "./shared/filter-dropdown";

interface AssetItemIProps {
  flag: string;
  name: string;
  price: string;
  change: number;
  isActive: boolean;
}

interface FilterIProps {
  activeTab: 'ft' | 'fx' | 'st';
}

const AssetItem: FC<AssetItemIProps> = (props) => {
  const changeClass = props.change >= 0 ? 'positive' : 'negative';

  const wrap = (word: string) => {
    const str = word.slice(0, 16);
    if (word.length > 16) {
      return str + '...';
    }
    return str;
  }

  return (
    <div className={`asset-item ${props.isActive && 'asset-active'}`}>
      <div className="flag">
        <img src={props.flag} alt={`${props.name} flag`}/>
      </div>
      <span className={'name-price'}>
        <span className="name">{wrap(props.name)}</span>
        <span className="price">{props.price}</span>
      </span>
      <span className={'change'}>
        <span className={changeClass}>{props.change > 0 ? `+${props.change}` : props.change}%</span>
        <Link to={'#'}>
          <i className="fa-solid fa-circle-info info"></i>
        </Link>
      </span>
    </div>
  );
};

const AssetFilters: FC<FilterIProps> = ({ activeTab }) => {
  const Favorites = () => (
    <div className={'filter'}>Favorites</div>
  );

  const Markets = () => {
    const options = [
      'Commodities',
      'Composites',
      'Crypto',
      'Currencies',
      'ETF',
      'Indices',
      'Metals',
      'Stocks'
    ];
    return (
      <FilterDropdown title={"All Markets"} options={options}/>
    )
  }

  const Profitability = () => {
    const options = ['Over 90%', 'Over 80%', 'Over 70%'];
    return (
      <FilterDropdown title={"Any Profitability"} options={options}/>
    )
  }

  const Countries = () => {
    const options = ['Europe', 'USA'];
    return (
      <FilterDropdown title={"All Countries"} options={options}/>
    )
  }

  return (
    <div className={'filters'}>
      <Favorites/>
      {activeTab === 'ft' && <Profitability/>}
      {activeTab !== 'st' && <Markets/>}
      {activeTab === 'st' && <Countries/>}
    </div>
  );
}

const AssetSorter: FC<FilterIProps> = ({ activeTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const options = useMemo(() => {
    const options = ["Name A-Z", "Name Z-A"];
    if (activeTab === 'ft') {
      options.unshift("Profitability");
    } else if (activeTab === 'fx') {
      options.unshift("24-hr changes (high to low)");
      options.unshift("24-hr changes (low to high)");
    } else {
      options.unshift("Ask Price (low to high)");
      options.unshift("Ask Price (high to low)");
    }
    return options;
  }, [activeTab]);

  return (
    <>
      <i className="fa-solid fa-arrow-up-short-wide" style={{ cursor: "pointer" }}
         onClick={() => setIsOpen(!isOpen)}></i>
      {isOpen && (
        <Dropdown dropdownRef={dropdownRef} options={options} setIsOpen={setIsOpen} title={'Sort by'}/>
      )}
    </>
  )
}

export const Assets = () => {
  const assets = [
    {
      flag: 'https://cfcdn.olymptrade.com/assets1/instrument/vector/ASIA.c98e6b5283b2504d839b790a34a65587.svg',
      name: 'Asia Composite Index',
      price: '5715.27',
      change: 0.13,
      isActive: false,
    },
    {
      flag: 'https://cfcdn.olymptrade.com/assets1/instrument/vector/AUDCAD.e901ac3802ec313628b2d1a3a121d422.svg',
      name: 'AUD/CAD',
      price: '0.88546',
      change: -0.40,
      isActive: true,
    },
  ];
  const [activeTab, setActiveTab] = useState<'ft' | 'fx' | 'st'>('fx');

  return (
    <div className={"assets"}>
      <div className="asset-list">
        <div className={"title"}>
          <h3>Assets</h3>
          <div className={"icons"}>
            <i className="fa-solid fa-up-right-and-down-left-from-center"></i>
            <i className="fa-solid fa-xmark"></i>
          </div>
        </div>
        <div className="tabs">
          <button className={`${activeTab === 'ft' && 'active'}`}
                  onClick={() => setActiveTab('ft')}>Fixed Time</button>
          <button className={`${activeTab === 'fx' && 'active'}`}
                  onClick={() => setActiveTab('fx')}>Forex</button>
          <button className={`${activeTab === 'st' && 'active'}`}
                  onClick={() => setActiveTab('st')}>Stocks</button>
        </div>
        <div className={'assets-body'}>
          <div style={{ padding: '0 16px' }}>
            <div className={'search'}>
              <input type="search" placeholder="Search"/>
              <i className="fa-solid fa-magnifying-glass"></i>
            </div>
          </div>
          <AssetFilters activeTab={activeTab}/>
          <div className={'table-header'}>
            <div className={'flag'}><AssetSorter activeTab={activeTab}/></div>
            <span className={'name-price'}>Name, Mid Price</span>
            <span className={'change'}>24-hr price changes</span>
          </div>
          <div>
            {assets.map(asset => (
              <AssetItem key={asset.name} {...asset} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
