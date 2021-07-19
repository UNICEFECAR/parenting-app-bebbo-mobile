import { useAppSelector } from './../../App';
import { MeasurementEntity } from './../database/schema/measurementDataSchema';
import { DateTime } from 'luxon';
export interface InterpretationText {
    text: string,
    name: string,
    articleId: number
}
export const getInterpretationWeightForHeight = (standardDeviation: any, gender: string, childBirthDate: any, childTaxonomyData:any,lastMeasurements: MeasurementEntity) => {
const childAgeId = childTaxonomyData.id;
    // console.log(standardDeviation,"<standardDeviation>")
    let interpretationText: InterpretationText | undefined = {
        name: "",
        text: "",
        articleId: 0
    };

    let goodMeasure: boolean | undefined = false;

    let chartData= standardDeviation.filter(
        (item) => item.growth_type == 6461 && item.growth_type == gender,
      );
     
    // if (gender == '40' || gender == '') {
    //     chartData = require("../assets/translations/appOfflineData/boystandardDeviation.json");
    //     // chartData = require("../assets/translations/appOfflineData/boystandardDeviation.json");
    // } else {
    //     chartData = require("../assets/translations/appOfflineData/girlstandardDeviation.json");
    // };
    // console.log(chartData);
    let weight: any = 0.0;
    let height: any = 0.0;
    if (lastMeasurements !== undefined && lastMeasurements.weight && lastMeasurements.height) {
        weight = parseFloat(lastMeasurements.weight) / 1000;
        height = Number(lastMeasurements.height).toFixed(1);
    };
    console.log(height,"height");
    let filteredDataForHeight = chartData.filter(
        (item) => (item.name == height  && item.growth_type == 6461),
      );
    
    // .find(data =>  {
    //       (data.name == height &&  data.growth_type==6461})
    console.log(filteredDataForHeight,"filteredDataForHeight<weightForHeight>");
    let childAgeInDays = 0;
    let measurementDate: DateTime = DateTime.local();
    if (childBirthDate) {
        let date = DateTime.fromJSDate(childBirthDate);
        let convertInDays = measurementDate.diff(date, "days").toObject().days;


        if (convertInDays !== undefined) childAgeInDays = Math.round(convertInDays);
    };
    // let allinterpretationData = require("../assets/translations/appOfflineData/interpretation.json");
    const allinterpretationData = useAppSelector(
        (state: any) =>
        JSON.parse(state.utilsData.weight_for_height),
      );
      
    // allinterpretationData = allinterpretationData['weight_for_height'];
    // console.log(allinterpretationData, "allinterpretationData_weight_for_height");

    let interpretationData = allinterpretationData?.find(item => item.child_age.indexOf(childAgeId ? childAgeId : 0) !== -1);

// console.log(interpretationData,"filtered");


    if (filteredDataForHeight) {
        if (height >= filteredDataForHeight?.sd2neg && height <= filteredDataForHeight.sd2) {
            interpretationText = interpretationData?.goodText;
            goodMeasure = true;
        };

        if (height <= filteredDataForHeight.sd2neg && height >= filteredDataForHeight.sd3neg) {
            interpretationText = interpretationData?.warrningSmallHeightText;
        };

        if (height < filteredDataForHeight.sd3neg) {
            interpretationText = interpretationData?.emergencySmallHeightText;
        };

        if (height >= filteredDataForHeight.sd2 && height <= filteredDataForHeight.sd3) {
            interpretationText = interpretationData?.warrningBigHeightText;
        };

        if (height > filteredDataForHeight.sd3) {
            interpretationText = interpretationData?.emergencyBigHeightText;
        };
    };

    if (interpretationText && interpretationText.name === "") {
        goodMeasure = undefined
    }

    return {
        interpretationText: interpretationText,
        goodMeasure: goodMeasure,
    };
}
export const getInterpretationHeightForAge = (standardDeviation: any, gender: string, childBirthDate: any,childTaxonomyData:any, lastMeasurements: MeasurementEntity) => {
    const childAgeId = childTaxonomyData.id;
    let interpretationText: InterpretationText | undefined = {
        name: "",
        text: "",
        articleId: 0
    };

    let goodMeasure: boolean | undefined = false;

    let chartData: any = standardDeviation;

    // if (gender === "41") {
    //     chartData = Data.Height_age_boys0_5
    // } else {
    //     chartData = Data.Height_age_girls0_5
    // }

    let length: number = 0;
    if (lastMeasurements !== undefined && lastMeasurements.weight && lastMeasurements.height) {
        length = parseFloat(lastMeasurements.height);
    };

    const childBirthDay = childBirthDate;
    let measurementDate: DateTime = DateTime.local();

    if (lastMeasurements !== undefined && lastMeasurements.measurementDate) {
        measurementDate = DateTime.fromJSDate(new Date(lastMeasurements.measurementDate));
    }

    let days = 0;

    if (childBirthDay) {
        let date = DateTime.fromJSDate(childBirthDay);
        let convertInDays = measurementDate.diff(date, "days").toObject().days;


        if (convertInDays !== undefined) days = Math.round(convertInDays);
    };
    let filteredData = chartData.find(data =>  {
        return  (data.name == days &&  data.growth_type==6456)})
        console.log("filteredData <height>",filteredData)


        const allinterpretationData = useAppSelector(
            (state: any) =>
            JSON.parse(state.utilsData.height_for_age),
          );
    // let allinterpretationData = require("../assets/translations/appOfflineData/interpretation.json");
    // allinterpretationData = allinterpretationData['weight_for_height'];
    // allinterpretationData = allinterpretationData['height_for_age'];
    console.log(allinterpretationData, "allinterpretationData_height_for_age");
    // let allinterpretationData = translateData('interpretationLenghtForAge') as (TranslateDataInterpretationLenghtForAge | null)


    let interpretationData = allinterpretationData?.
        find(item => item.child_age.indexOf(childAgeId ? childAgeId : 0) !== -1);


    if (filteredData !== undefined) {
        if (length >= filteredData.sd2neg && length <= filteredData.sd3) {
            interpretationText = interpretationData?.goodText;
            goodMeasure = true;
        };

        if (length < filteredData.sd2neg && length > filteredData.sd3neg) {
            interpretationText = interpretationData?.warrningSmallLengthText;
        };

        if (length < filteredData.sd3neg) {
            interpretationText = interpretationData?.emergencySmallLengthText;
        };
        if (length > filteredData.sd3) {
            interpretationText = interpretationData?.warrningBigLengthText;
        };
    };
    if (interpretationText && interpretationText.name === "") {
        goodMeasure = undefined
    }

    return {
        interpretationText: interpretationText,
        goodMeasure: goodMeasure
    };
};