import React, { useEffect } from "react";
import { IDataItem } from "$models";
import { drawChart } from "./utils";
import classes from "./Chart.module.css";

const canvasId = "chart";

interface IProps {
  data: IDataItem[];
}

export const Chart = (props: IProps) => {
  const { data } = props;

  useEffect(() => {
    drawChart(canvasId, data);
  }, [data]);

  return (
    <div className={classes.chart}>
      <canvas id={canvasId} width="600px" height="400px">
        График
      </canvas>
    </div>
  );
};
