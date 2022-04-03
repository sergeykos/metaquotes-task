import React, { useCallback, useEffect, useState } from "react";
import { isEmpty } from "ramda";

import { Button, Select } from "$components";
import { initApp } from "$operations";
import { IChartItem } from "$models";
import { Chart } from "../Chart";
import classes from "./Main.module.css";

export const Main = () => {
  const [isInit, toggleIsInit] = useState(false);
  const [initError, changeInitError] = useState();
  const [temperature, saveTemperature] = useState<IChartItem[]>([]);
  const [precipitation, savePrecipitation] = useState<IChartItem[]>([]);

  const onChangeDateFrom = useCallback((item: string) => item, []);
  const onChangeDateTo = useCallback((item: string) => item, []);
  const onChangeIsInit = useCallback(() => toggleIsInit(true), [toggleIsInit]);

  useEffect(() => {
    initApp().then(
      (result) => {
        if (result[0]?.result) {
          savePrecipitation(result[0]?.result);
        }

        if (result[1]?.result) {
          saveTemperature(result[0]?.result);
        }

        onChangeIsInit();
      },
      (error) => {
        onChangeIsInit();
        changeInitError(error);
      }
    );
  }, []);

  if (!isInit) {
    return <div className={classes.main}>IndexedDB slowly initializing...</div>;
  }

  if (initError) {
    return (
      <div className={classes.main}>
        An error occurred while connecting to indexedDB: {initError}
      </div>
    );
  }

  if (isEmpty(temperature) || isEmpty(precipitation)) {
    return <div className={classes.main}>Got empty data from server...</div>;
  }

  console.log(temperature, precipitation);

  return (
    <div className={classes.main}>
      <div className={classes.container}>
        <div className={classes.title}>Архив метеослужбы</div>
        <div className={classes.content}>
          <div>
            <div className={classes.buttons}>
              <Button onClick={() => void 0}>Температура</Button>
              <Button onClick={() => void 0}>Осадки</Button>
            </div>
          </div>
          <div className={classes.rightSide}>
            <div className={classes.selects}>
              <Select
                value={"2000"}
                values={["1999", "2000"]}
                onChange={onChangeDateFrom}
              />
              <Select
                value={"2000"}
                values={["1999", "2000"]}
                onChange={onChangeDateTo}
              />
            </div>
            <Chart />
          </div>
        </div>
      </div>
    </div>
  );
};
