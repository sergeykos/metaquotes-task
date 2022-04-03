import React, { useCallback, useState } from "react";
import { Option } from "./Option";
import classes from "./Select.module.css";

interface IProps<T> {
  value: T;
  values: T[];
  onChange: (item: T) => void;
}

export const Select = <T extends unknown>(props: IProps<T>) => {
  const { value, values, onChange } = props;

  const [isOpened, toggleIsOpened] = useState(false);

  const onToggle = useCallback(
    () => toggleIsOpened(!isOpened),
    [isOpened, toggleIsOpened]
  );

  const onSelect = useCallback(
    (item: T) => {
      onChange(item);
      toggleIsOpened(false);
    },
    [toggleIsOpened, onChange]
  );

  return (
    <div className={classes.container}>
      <div className={classes.selectContainer} onClick={onToggle}>
        <div className={classes.selected}>{value}</div>
        <div className={classes.arrow}>
          <div className={classes.arrowDown} />
        </div>
      </div>
      {isOpened && (
        <div className={classes.options}>
          {values.map((value, i) => (
            <Option key={i} value={value} onClick={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
};
