import AssetList from "./partials/assets";
import Sidebar from "./partials/sidebar";

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
