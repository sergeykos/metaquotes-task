import { IDataItem } from "$models";
import { isEmpty } from "ramda";

const scaleY = 3;

export const drawChart = (htmlCanvasId: string, data: IDataItem[]) => {
  const canvas = document.getElementsByTagName("canvas")[0];
  const ctx = canvas.getContext("2d");
  const offsetY = canvas.height / 2;
  const items = data.slice(0, canvas.width);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (isEmpty(data)) {
    ctx.font = "40px Verdana";
    ctx.strokeText("No data for this period", 50, 150);

    return;
  }

  ctx.save();

  ctx.translate(0, canvas.height);
  ctx.scale(1, -1);

  ctx.beginPath();

  ctx.moveTo(0, items[0].v * scaleY);

  items.forEach((item, i) => {
    const y =
      item.v >= 0 ? item.v * scaleY + offsetY : offsetY - item.v * scaleY;

    ctx.lineTo(i, y);
  });

  ctx.restore();

  ctx.stroke();
};
