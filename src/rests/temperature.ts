import { rest } from "$utils";
import { IChartItem } from "$models";

export const fetchTemperature = () => {
  return rest<IChartItem[]>("/temperature", "POST");
};
