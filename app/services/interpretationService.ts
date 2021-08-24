import { useAppSelector } from './../../App';
import { MeasurementEntity } from './../database/schema/measurementDataSchema';
import { DateTime } from 'luxon';
export interface InterpretationText {
    text: string,
    name: string,
    articleID: number[]
}
export const getInterpretationWeightForHeight = (standardDeviation: any, childTaxonomyData: any, lastMeasurements: MeasurementEntity) => {
    const childAgeId = childTaxonomyData.id;
    console.log(childAgeId, "<childAgeId>");
    // console.log(standardDeviation, "<standardDeviation>")
    let interpretationText: InterpretationText | undefined = {
        name: "",
        text: "",
        articleID: [],
    };
    // console.log(gender,"<gender>")
    let goodMeasure: boolean | undefined = false;
    let weight: any = 0.0;
    let height: any = 0.0;
    // console.log(lastMeasurements,"<lastMeasurements>");
    if (lastMeasurements !== undefined && lastMeasurements.weight) {
        weight = Number(lastMeasurements.weight).toFixed(1);
        height = (Number(lastMeasurements.height) % 1 !== 0) ? Number(lastMeasurements.height).toFixed(1) :Number(lastMeasurements.height);
        //if lastMeasurements.height is 0.0 then 
    };
    // console.log(chartData,"chartData");
    // console.log(weight,height,"<formatted>")
    const allinterpretationData = useAppSelector(
        (state: any) =>
            JSON.parse(state.utilsData.weight_for_height),
    );
    let filteredDataForHeight = standardDeviation.find(data => data.name == height);
    // console.log(filteredDataForHeight,"<weightforheight>",height)
    let interpretationData = allinterpretationData?.find(item => item.child_age.indexOf(childAgeId ? childAgeId : 0) !== -1);
    // console.log(filteredDataForHeight,interpretationData,"filtered");
    if (filteredDataForHeight) {
        if (weight >= filteredDataForHeight?.sd2neg && weight <= filteredDataForHeight.sd2) {
            interpretationText = interpretationData?.goodText;
            goodMeasure = true;
        };

        if (weight <= filteredDataForHeight.sd2neg && weight >= filteredDataForHeight.sd3neg) {
            interpretationText = interpretationData?.warrningSmallHeightText;
        };

        if (weight < filteredDataForHeight.sd3neg) {
            interpretationText = interpretationData?.emergencySmallHeightText;
        };

        if (weight >= filteredDataForHeight.sd2 && weight <= filteredDataForHeight.sd3) {
            interpretationText = interpretationData?.warrningBigHeightText;
        };

        if (weight > filteredDataForHeight.sd3) {
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
export const getInterpretationHeightForAge = (standardDeviation: any, childBirthDate: any, childTaxonomyData: any, lastMeasurements: MeasurementEntity) => {
    const childAgeId = childTaxonomyData.id;
    // console.log(childAgeId,"childAgeId")
    let interpretationText: InterpretationText | undefined = {
        name: "",
        text: "",
        articleID: []
    };

    let goodMeasure: boolean | undefined = false;
    let chartData: any = standardDeviation;
    let length: number = 0;
    if (lastMeasurements !== undefined && lastMeasurements.weight && lastMeasurements.height) {
        length = parseFloat(lastMeasurements.height);
    };

    // const date1 = DateTime.fromMillis(lastMeasurements.measurementDate);
//   const date2 = DateTime.fromISO(childBirthDate);

//   const diff: any = date1.diff(date2, "days");

//   console.log("helllo",diff)
    const childBirthDay = childBirthDate;
    let measurementDate: DateTime = DateTime.local();
    // console.log(lastMeasurements.measurementDate,"lastMeasurements.measurementDate",childBirthDate)
    if (lastMeasurements !== undefined && lastMeasurements.measurementDate) {
        measurementDate = DateTime.fromMillis(lastMeasurements.measurementDate);
    }
    let days = 0;
// console.log(measurementDate,"measurementDate",childBirthDay)
    if (childBirthDay) {
        let date = DateTime.fromISO(childBirthDay);
        // console.log(date,"DOB");
        let convertInDays = measurementDate.diff(date, "days").days;
        // console.log(measurementDate.diff(date, "days"),"convertInDays")

        if (convertInDays !== undefined) {days = Math.round(convertInDays)};
    };
    // console.log(chartData,"chartData")
    let filteredData = chartData.find(data => data.name == days);
    // console.log(filteredData,"<FileterData>",days)
    const allinterpretationData = useAppSelector(
        (state: any) =>
            JSON.parse(state.utilsData.height_for_age),
    );
    // console.log(allinterpretationData, "allinterpretationData_height_for_age");
    let interpretationData = allinterpretationData?.
        find(item => item.child_age.indexOf(childAgeId ? childAgeId : 0) !== -1);

    // console.log(interpretationData, "interpretationData");
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