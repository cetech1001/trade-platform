import {FC, Fragment, JSX, useEffect, useRef, useState} from "react";
import "./styles/Popup.css";

interface IProps {
  popupLauncher: JSX.Element;
  popupContent: JSX.Element;
}

export const Popup: FC<IProps> = (props) => {
  const [showPopup, setShowPopup] = useState(false);
  const containerRef = useRef(null);

  const handleClickOutside = (event: { target: any; }) => {
    // @ts-expect-error idk
    if (containerRef.current && !containerRef.current?.contains(event.target)) {
      setShowPopup(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className={'parent-container'}>
      <span onClick={() => setShowPopup(!showPopup)}>
        {props.popupLauncher}
      </span>
      {showPopup && (
        <div className={'popup'}>
          {props.popupContent}
        </div>
      )}
    </div>
  );
}
