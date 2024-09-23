import { useEffect, useRef } from 'react';
import {connect} from "react-redux";
import {RootState} from "@coinvant/store";

interface IProps {
    symbol: string | undefined;
}

const mapStateToProps = (state: RootState) => ({
    symbol: state.tradeAsset.currentAsset?.symbol,
})

export const Chart = connect(mapStateToProps)((props: IProps) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
      if (container.current) {
          container.current.innerHTML = '';
      }

      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
          "autosize": true,
          "symbol": props.symbol?.toUpperCase() || "BTC",
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "enable_publishing": false,
          "allow_symbol_change": true,
          "calendar": false,
          "support_host": "https://www.tradingview.com",
      });

      container.current?.appendChild(script);
    }, [props.symbol]);

  return (
    <div className={"chart"}>
      <div className="tradingview-widget-container" ref={container} style={{height: "100%", width: "100%"}}>
        <div className="tradingview-widget-container__widget" id="tradingview_widget"
             style={{height: "calc(100% - 32px)", width: "100%"}}></div>
      </div>
    </div>
  );
});
