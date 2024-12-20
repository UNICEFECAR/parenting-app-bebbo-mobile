import { appConfig } from '../instance';
import { DateTime } from 'luxon';
import { MeasuresEntity } from '../database/schema/ChildDataSchema';


export interface SingleAreaDataFormat {
  x?: number | null;
  y: number | null;
  y0: number | null;
}
export interface ChartAreaDataFormat {
  topArea: SingleAreaDataFormat[];
  middleArea: SingleAreaDataFormat[];
  bottomArea: SingleAreaDataFormat[];
}


export const setInitialWeightValues = (weightValue: any): any => {
  if (weightValue + ''.indexOf('.') === -1) {
    return { weight: weightValue, weight1: 0 };
  } else {
    const w = (weightValue + '').split('.');
    if (weightValue && String(w[1]).length == 1) {
      return { weight: Number(w[0]), weight1: Number(w[1]) * 10 };
    } else {
      return {
        weight: Number(w[0]) > appConfig.maxWeight ? appConfig.maxWeight : Number(w[0]),
        weight1: Number(w[0]) > appConfig.maxWeight ? (Number(w[0]) - appConfig.maxWeight) * 100 : (w[1] == undefined ? 0 : Number(w[1])),
      };
    }
  }
};
export const setInitialHeightValues = (heightValue: any): any => {
  if (heightValue + ''.indexOf('.') === -1) {
    return { height: heightValue, height1: 0 };
  } else {
    const w = (heightValue + '').split('.');
    if (heightValue && String(w[1]).length == 1) {
      return { height: Number(w[0]), height1: Number(w[1]) * 10 };
    } else {
      return {
        height: Number(w[0]) > appConfig.maxHeight ? appConfig.maxHeight : Number(w[0]),
        height1: Number(w[0]) > appConfig.maxHeight ? (Number(w[0]) - appConfig.maxHeight) * 100 : (w[1] == undefined ? 0 : Number(w[1])),

      };
    }
  }
};

export const convertMeasuresData = (
  measures: MeasuresEntity[],
  childBirthDay: Date,
): any => {
  let measurementDateInDays = 0;

  const measuresData: any[] = [];

  measures.forEach((item) => {
    if (item.measurementDate) {
      const childAge = DateTime.fromJSDate(new Date(childBirthDay));
      const date = DateTime.fromMillis(item.measurementDate);

      const days = date.diff(childAge, 'days').toObject().days;

      measurementDateInDays = days ? Math.round(days) : 0;
    }

    if (measurementDateInDays >= 0 && measurementDateInDays < 1855) {
      measuresData.push({
        weight: item.weight ? parseFloat(item.weight) : 0,
        height: item.height ? parseFloat(item.height) : 0,
        measurementDate: measurementDateInDays ? measurementDateInDays : 0,
      });
    }
  });

  return measuresData;
};
export const formatDaysData = (data: any): any => {
  const topArea: SingleAreaDataFormat[] = [];
  const middleArea: SingleAreaDataFormat[] = [];
  const bottomArea: SingleAreaDataFormat[] = [];
  data.map((item: any) => {
    topArea.push({ x: Number(item.name) / 30, y: item.sd3, y0: item.sd4 });
    middleArea.push({ x: Number(item.name) / 30, y: item.sd3neg, y0: item.sd3 });
    bottomArea.push({ x: Number(item.name) / 30, y: item.sd3neg, y0: item.sd4neg });
  })

  const obj: ChartAreaDataFormat = {
    topArea: topArea,
    middleArea: middleArea,
    bottomArea: bottomArea,
  }

  return obj;
}
export const formatHeightData = (data: any, param: any): any => {
  const topArea: SingleAreaDataFormat[] = [];
  const middleArea: SingleAreaDataFormat[] = [];
  const bottomArea: SingleAreaDataFormat[] = [];
  if (param == 'height') {
    data.map((item: any) => {
      topArea.push({ x: Number(item.name) / 30, y: item.sd3, y0: item.sd4 });
      middleArea.push({ x: Number(item.name) / 30, y: item.sd3neg, y0: item.sd3 });
      bottomArea.push({ x: Number(item.name) / 30, y: item.sd3neg, y0: item.sd4neg });
    })
  }
  else {
    data.map((item: any) => {
      topArea.push({ x: Number(item.name), y: item.sd3, y0: item.sd4 });
      middleArea.push({ x: Number(item.name), y: item.sd3neg, y0: item.sd3 });
      bottomArea.push({ x: Number(item.name), y: item.sd3neg, y0: item.sd4neg });
    })
  }

  const obj: ChartAreaDataFormat = {
    topArea: topArea,
    middleArea: middleArea,
    bottomArea: bottomArea,
  }

  return obj;
}

