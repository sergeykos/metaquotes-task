import dayjs from "dayjs";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { uniqBy, isEmpty, sortBy } from "ramda";

import { Button, Select } from "$components";
import { initApp } from "$operations";
import { IChartItem } from "$models";
import { Chart } from "../Chart";
import classes from "./Main.module.css";

enum SelectedTab {
  temperature,
  precipitation,
}

export const Main = () => {
  const [dateFrom, changeDateFrom] = useState<number>(1881);
  const [dateTo, changeDateTo] = useState<number>(2006);
  const [selectedTab, changeTab] = useState(SelectedTab.temperature);
  const [isInit, toggleIsInit] = useState(false);
  const [initError, changeInitError] = useState();
  const [temperature, saveTemperature] = useState<IChartItem[]>([]);
  const [precipitation, savePrecipitation] = useState<IChartItem[]>([]);

  const onSelectTemperatureTab = useCallback(
    () => changeTab(SelectedTab.temperature),
    [changeTab]
  );
  const onSelectPrecipitationTab = useCallback(
    () => changeTab(SelectedTab.precipitation),
    [changeTab]
  );
  const onChangeDateFrom = useCallback(
    (item: number) => {
      if (item > dateTo) {
        changeDateTo(item);
      }

      changeDateFrom(item);
    },
    [dateTo, changeDateFrom, changeDateTo]
  );
  const onChangeDateTo = useCallback(
    (item: number) => {
      if (item < dateFrom) {
        changeDateFrom(item);
      }

      changeDateTo(item);
    },
    [dateFrom, changeDateFrom, changeDateTo]
  );
  const onChangeIsInit = useCallback(() => toggleIsInit(true), [toggleIsInit]);

  const chartData = useMemo(() => {
    const data =
      selectedTab === SelectedTab.temperature ? temperature : precipitation;

    const dayjsDateFrom = dayjs()
      .set("year", dateFrom)
      .set("month", 0)
      .set("date", 1);
    const dayjsDateTo = dayjs()
      .set("year", dateTo)
      .set("month", 0)
      .set("date", 1);

    return sortBy(({ t }) => dayjs(t).toDate(), data)
      .filter(
        ({ t }) =>
          (dayjs(t).isBefore(dayjsDateTo) && dayjs(t).isAfter(dayjsDateFrom)) ||
          dayjs(t).isSame(dayjsDateTo, "year") ||
          dayjs(t).isSame(dayjsDateFrom, "year")
      )
      .map(({ t, v }) => ({ t, v: +v }));
  }, [dateFrom, dateTo, temperature, precipitation, selectedTab]);

  const dateItems = useMemo(() => {
    const data =
      selectedTab === SelectedTab.temperature ? temperature : precipitation;

    return uniqBy(({ t }) => dayjs(t).get("year"), data).map(({ t }) =>
      dayjs(t).get("year")
    );
  }, [selectedTab, chartData]);

  useEffect(() => {
    initApp().then(
      (result) => {
        if (!isEmpty(result[0]?.result)) {
          savePrecipitation(result[0]?.result);
        }

        if (!isEmpty(result[1]?.result)) {
          saveTemperature(result[1]?.result);
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

  return (
    <div className={classes.main}>
      <div className={classes.container}>
        <div className={classes.title}>Архив метеослужбы</div>
        <div className={classes.content}>
          <div>
            <div className={classes.buttons}>
              <Button onClick={onSelectTemperatureTab}>Температура</Button>
              <Button onClick={onSelectPrecipitationTab}>Осадки</Button>
            </div>
          </div>
          <div className={classes.rightSide}>
            <div className={classes.selects}>
              <Select
                value={dateFrom}
                values={dateItems}
                onChange={onChangeDateFrom}
              />
              <Select
                value={dateTo}
                values={dateItems}
                onChange={onChangeDateTo}
              />
            </div>
            <Chart data={chartData} />
          </div>
        </div>
      </div>
    </div>
  );
};
