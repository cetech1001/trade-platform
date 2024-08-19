import { useEffect, useRef, memo } from 'react';
import "../styles/Chart.css";

export const Chart = memo(() => {
  const container = useRef<HTMLDivElement>(null);
    const widgetRef = useRef<any>(null);

  useEffect(
    () => {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "autosize": true,
          "symbol": "BINANCE:BTCUSDT",
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "enable_publishing": false,
          "allow_symbol_change": true,
          "calendar": false,
          "support_host": "https://www.tradingview.com"
        }`;

        script.onload = () => {
            console.log("Script has loaded");
            // @ts-ignore
            if (window.TradingView) {
                console.log("Trading view is available");
                // @ts-ignore
                widgetRef.current = window.TradingView.widget({
                    "autosize": true,
                    "symbol": "BINANCE:BTCUSDT",
                    "interval": "D",
                    "timezone": "Etc/UTC",
                    "theme": "dark",
                    "style": "1",
                    "locale": "en",
                    "enable_publishing": false,
                    "allow_symbol_change": true,
                    "calendar": false,
                    "container_id": container.current?.querySelector('.tradingview-widget-container__widget')?.id
                });

                widgetRef.current.onSymbolChange().subscribe(null, (newSymbol: string) => {
                    console.log("Subscription created");
                    console.log("New symbol:", newSymbol);
                });
            }
        };

      container.current?.appendChild(script);
    },
    []
  );

  return (
    <div className={"chart"}>
      <div className="tradingview-widget-container" ref={container} style={{height: "100%", width: "100%"}}>
        <div className="tradingview-widget-container__widget" id="tradingview_widget"
             style={{height: "calc(100% - 32px)", width: "100%"}}></div>
      </div>
    </div>
  );
});
