import React from "react";
import classes from "./Button.module.css";

interface IProps {
  onClick: () => void;
}

export const Button: React.FC<IProps> = (props) => {
  const { children, onClick } = props;

  return (
    <button className={classes.button} onClick={onClick}>
      {children}
    </button>
  );
};
