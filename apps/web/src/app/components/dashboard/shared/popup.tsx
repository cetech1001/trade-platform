import {FC, JSX, useEffect, useRef, useState} from "react";

interface IProps {
  popupLauncher: JSX.Element;
  popupContent: JSX.Element;
  top?: number;
  left?: number;
  closePopup?: boolean;
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

  useEffect(() => {
    if (props.closePopup) {
      setShowPopup(false);
    }
  }, [props.closePopup]);

  const [styles, setStyles] = useState({});

  useEffect(() => {
    if (props.top || props.top === 0) {
      setStyles(prevState => ({
        ...prevState,
        top: props.top,
      }));
    }
    if (props.left || props.left === 0) {
      setStyles(prevState => ({
        ...prevState,
        left: props.left,
      }));
    }
  }, [props]);

  return (
    <div ref={containerRef} className={'parent-container'}>
      <span onClick={() => setShowPopup(!showPopup)}>
        {props.popupLauncher}
      </span>
      {showPopup && (
        <div className={'popup'} style={styles} /*style={{
          top: props.top || 0,
          left: props.left !== undefined ? props.left : -295
        }}*/>{props.popupContent}</div>
      )}
    </div>
  );
}
