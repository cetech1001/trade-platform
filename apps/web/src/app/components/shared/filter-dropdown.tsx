import {FC, useRef, useState} from "react";
import {Dropdown} from "./dropdown";

interface IProps {
  title: string;
  options: string[];
}

export const FilterDropdown: FC<IProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  return (
    <div className={'filter'} onClick={() => setIsOpen(!isOpen)}>
      {props.title}
      <i className="fa-solid fa-chevron-down"></i>
      {isOpen && (
        <Dropdown dropdownRef={dropdownRef} options={props.options} setIsOpen={setIsOpen}/>
      )}
    </div>
  )
}
