import { VectorImage } from 'react-native-vector-image';
import { View } from 'react-native';
import { useAppSelector } from './../../App';


import { DateTime } from 'luxon';
import { MeasuresEntity } from '../database/schema/ChildDataSchema';
import { MeasurementEntity } from '../database/schema/measurementDataSchema';
export interface singleAreaDataFormat {
  x?: number | null,
  y: number | null,
  y0: number | null,
}
export interface chartAreaDataFormat {
  topArea: singleAreaDataFormat[],
  middleArea: singleAreaDataFormat[],
  bottomArea: singleAreaDataFormat[],
}


export const setInitialWeightValues = (weightValue: any) => {
  // console.log(weightValue,"weightValue")
  // console.log(weightValue+ ''.indexOf('.'),"indexOf");
  if (weightValue + ''.indexOf('.') === -1) {
    // console.log("in if")
    return { weight: weightValue, weight1: 0 };
  } else {
    let w = (weightValue + '').split('.');
    // console.log(w[1],"w1")
    if (weightValue && String(w[1]).length == 1) {
      // console.log("in else if")
      return { weight: Number(w[0]), weight1: Number(w[1]) * 10 };
    } else {
      // console.log("in else else")
      return {
        weight: Number(w[0]),
        weight1: w[1] == undefined ? 0 : Number(w[1]),
      };
    }
  }

  // console.log(weight,weight1)
};
export const setInitialHeightValues = (heightValue: any) => {
  // console.log(heightValue);
  // console.log(heightValue,"heightValue")
  // console.log(heightValue+ ''.indexOf('.'),"indexOf");
  if (heightValue + ''.indexOf('.') === -1) {
    // console.log("in if")
    return { height: heightValue, height1: 0 };
  } else {
    let w = (heightValue + '').split('.');
    if (heightValue && String(w[1]).length == 1) {
      return { height: Number(w[0]), height1: Number(w[1]) * 10 };
    } else {
      return {
        height: Number(w[0]),
        height1: w[1] == undefined ? 0 : Number(w[1]),
      };
    }
  }
  // console.log(height,height1)
};

export const convertMeasuresData = (
  measures: MeasuresEntity[],
  childBirthDay: Date,
) => {
  let measurementDateInDays: number = 0;

  let measuresData: any[] = [];

  measures.forEach((item) => {
    if (item.measurementDate) {
      let childAge = DateTime.fromJSDate(new Date(childBirthDay));
      let date = DateTime.fromMillis(item.measurementDate);

      let days = date.diff(childAge, 'days').toObject().days;

      measurementDateInDays = days ? Math.round(days) : 0;
    }

    if (measurementDateInDays < 1855) {
      measuresData.push({
        weight: item.weight ? parseFloat(item.weight) : 0,
        height: item.height ? parseFloat(item.height) : 0,
        measurementDate: measurementDateInDays ? measurementDateInDays : 0,
      });
    }
  });

  return measuresData;
};
export const formatDaysData = (data: any) => {
  let obj: chartAreaDataFormat;

  let topArea: singleAreaDataFormat[] = [];
  let middleArea: singleAreaDataFormat[] = [];
  let bottomArea: singleAreaDataFormat[] = [];
  // console.log("formatDaysData",data)
  data.map(item => {
    topArea.push({ x: Number(item.name) / 30, y: item.sd3, y0: item.sd4 });
    middleArea.push({ x: Number(item.name) / 30, y: item.sd3neg, y0: item.sd3 });
    bottomArea.push({ x: Number(item.name) / 30, y: item.sd3neg, y0: item.sd4neg });
  })

  obj = {
    topArea: topArea,
    middleArea: middleArea,
    bottomArea: bottomArea,
  }

  return obj;
}
export const formatHeightData = (data: any) => {
  let obj: chartAreaDataFormat;
  // console.log(JSON.stringify(data, null, 4), "data")

  let topArea: singleAreaDataFormat[] = [];
  let middleArea: singleAreaDataFormat[] = [];
  let bottomArea: singleAreaDataFormat[] = [];
  // console.log("formatHeightData",data)
  data.map(item => {
    // if (Number(item.name) >= 45 && Number(item.name) <= 87) {
    //     topArea.push({ x: Number(item.name), y: item.sd3, y0: item.sd4 });
    //     middleArea.push({ x: Number(item.name), y: item.sd3neg, y0: item.sd3 });
    //     bottomArea.push({ x: Number(item.name), y: item.sd3neg, y0: item.sd4neg });
    // }

    // if (Number(item.name) > 87.0) {
    topArea.push({ x: Number(item.name), y: item.sd3, y0: item.sd4 });
    middleArea.push({ x: Number(item.name), y: item.sd3neg, y0: item.sd3 });
    bottomArea.push({ x: Number(item.name), y: item.sd3neg, y0: item.sd4neg });
    // }
  })
  obj = {
    topArea: topArea,
    middleArea: middleArea,
    bottomArea: bottomArea,
  }

  return obj;
}

