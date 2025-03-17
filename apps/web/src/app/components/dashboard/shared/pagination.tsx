import React, { Dispatch, FC, SetStateAction } from 'react';

interface IProps {
  setOptions: Dispatch<SetStateAction<any>>;
  currentPage: number;
  totalPages: number;
}

export const Pagination: FC<IProps> = (props) => {
  const onPrevClick = () => {
    if (props.currentPage > 1) {
      props.setOptions((prevState: any) => ({
        ...prevState,
        page: prevState.page - 1,
      }));
    }
  }

  const onNextClick = () => {
    if (props.currentPage < props.totalPages) {
      props.setOptions((prevState: any) => ({
        ...prevState,
        page: prevState.page + 1,
      }));
    }
  }

  return (
    <div style={{display: 'flex', gap: '16px', justifyContent: "center", marginBottom: "1rem"}}>
      <i className="cursor-pointer fa-solid fa-angles-left" style={{ color: "#ffffff" }}
         onClick={onPrevClick}></i>
      <span style={{ color: "#ffffff" }}>
          Page {props.currentPage} of {props.totalPages}
        </span>
      <i className="cursor-pointer fa-solid fa-angles-right" style={{ color: "#ffffff" }}
         onClick={onNextClick}></i>
    </div>
  )
}
