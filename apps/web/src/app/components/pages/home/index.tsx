import AssetList from "./partials/assets";
import Sidebar from "./partials/sidebar";
import TradingViewWidget from "./partials/trading-view-widget";

export const Home = () => {
  return (
    <>
      <AssetList/>
      <div className={'chart'}>
        {/*<TradingViewWidget/>*/}
      </div>
      <Sidebar/>
    </>
  );
}
