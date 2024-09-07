import {Dispatch, FC, MutableRefObject, SetStateAction, useEffect} from "react";
import "../../../../styles/Dropdown.css";
import {capitalizeFirstLetter} from "../../../helpers";

interface IProps {
  dropdownRef: MutableRefObject<null>;
  options: string[];
  title?: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  default?: string;
  action: (value: string) => void;
}

export const Dropdown: FC<IProps> = (props) => {
  useEffect(() => {
    const handleClickOutside = (event: { target: any; }) => {
      //@ts-expect-error idk
      if (props.dropdownRef.current && !props.dropdownRef.current?.contains(event.target)) {
        props.setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={props.dropdownRef} className={'dropdown'}>
      {props.title && (
        <span className={'dropdown-header'}>{props.title}</span>
      )}
      <ul style={{listStyleType: 'none'}}>
        {props.default && (
            <li className={'dropdown-option'} onClick={() => props.action("")}
                style={{padding: '10px', cursor: 'pointer'}}>
              {props.default}
            </li>
        )}
        {props.options.map((option, index) => (
            <li key={index} className={'dropdown-option'} onClick={() => props.action(option)}
                style={{padding: '10px', cursor: 'pointer'}}>
            {capitalizeFirstLetter(option)}
          </li>
        ))}
      </ul>
    </div>
  );
}
