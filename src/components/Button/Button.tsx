import React from "react";
import classes from "./Button.module.css";

interface IProps {
  onClick: () => void;
}

export const Button: React.FC<IProps> = (props) => {
  const { children } = props;

  return <button className={classes.button}>{children}</button>;
};
