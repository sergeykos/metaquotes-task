import { rest } from "$utils";
import { IChartItem } from "$models";

export const fetchPrecipitation = () => {
  return rest<IChartItem[]>("/precipitation", "POST");
};
