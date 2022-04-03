import React, { useCallback } from "react";
import classes from "./Option.module.css";

interface IProps<T> {
  value: T;
  onClick: (value: T) => void;
}

export const Option = <T extends unknown>(props: IProps<T>) => {
  const { value, onClick } = props;

  const handleClick = useCallback(() => onClick(value), [value, onClick]);

  return (
    <div className={classes.option} onClick={handleClick}>
      {value}
    </div>
  );
};
