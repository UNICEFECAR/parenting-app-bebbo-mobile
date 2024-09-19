import { useAppSelector } from './../../App';
import { MeasurementEntity } from './../database/schema/measurementDataSchema';
import { DateTime } from 'luxon';
export interface InterpretationText {
    text: string;
    name: string;
    articleID: number[];
}
export const getInterpretationWeightForHeight = (standardDeviation: any, childTaxonomyData: any, lastMeasurements: MeasurementEntity):any => {
    let childAgeId:any;
    if(childTaxonomyData?.prematureTaxonomyId!=null && childTaxonomyData?.prematureTaxonomyId!="" && childTaxonomyData?.prematureTaxonomyId!=undefined){
        childAgeId=childTaxonomyData?.prematureTaxonomyId;
    }
    else{
        childAgeId=childTaxonomyData.id;
    }
   console.log(childAgeId, "<childAgeId>");
    let interpretationText: InterpretationText | undefined = {
        name: "",
        text: "",
        articleID: [],
    };
    let goodMeasure: boolean | undefined = false;
    let weight: any = 0.0;
    let height: any = 0.0;
     if (lastMeasurements !== undefined && lastMeasurements.weight) {
        weight = Number(lastMeasurements.weight).toFixed(1);
        height = (Number(lastMeasurements.height) % 1 !== 0) ? Number(lastMeasurements.height).toFixed(1) :Number(lastMeasurements.height);
    }
    const allinterpretationData = useAppSelector(
        (state: any) =>
            JSON.parse(state.utilsData.weight_for_height),
    );
    const filteredDataForHeight = standardDeviation.find((data:any) => data.name == height);
    const interpretationData = allinterpretationData?.find((item:any) => item.child_age.indexOf(childAgeId ? childAgeId : 0) !== -1);
    if (filteredDataForHeight) {
        if (weight >= filteredDataForHeight?.sd2neg && weight <= filteredDataForHeight.sd2) {
            interpretationText = interpretationData?.goodText;
            goodMeasure = true;
        }

        if (weight <= filteredDataForHeight.sd2neg && weight >= filteredDataForHeight.sd3neg) {
            interpretationText = interpretationData?.warrningSmallHeightText;
        }

        if (weight < filteredDataForHeight.sd3neg) {
            interpretationText = interpretationData?.emergencySmallHeightText;
        }

        if (weight >= filteredDataForHeight.sd2 && weight <= filteredDataForHeight.sd3) {
            interpretationText = interpretationData?.warrningBigHeightText;
        }

        if (weight > filteredDataForHeight.sd3) {
            interpretationText = interpretationData?.emergencyBigHeightText;
        }
    }

    if (interpretationText && interpretationText.name === "") {
        goodMeasure = undefined
    }

    return {
        interpretationText: interpretationText,
        goodMeasure: goodMeasure,
    };
}
export const getInterpretationHeightForAge = (standardDeviation: any, childBirthDate: any, childTaxonomyData: any, lastMeasurements: MeasurementEntity):any => {
    let childAgeId:any;
    if(childTaxonomyData?.prematureTaxonomyId!=null && childTaxonomyData?.prematureTaxonomyId!="" && childTaxonomyData?.prematureTaxonomyId!=undefined){
    childAgeId=childTaxonomyData?.prematureTaxonomyId;
    }
    else{
        childAgeId=childTaxonomyData.id;
    }
    let interpretationText: InterpretationText | undefined = {
        name: "",
        text: "",
        articleID: []
    };
    let goodMeasure: boolean | undefined = false;
    const chartData: any = standardDeviation;
    let length = 0;
    if (lastMeasurements !== undefined && lastMeasurements.weight && lastMeasurements.height) {
        length = parseFloat(lastMeasurements.height);
    }
    const childBirthDay = childBirthDate;
    let measurementDate: DateTime = DateTime.local();
    if (lastMeasurements !== undefined && lastMeasurements.measurementDate) {
        measurementDate = DateTime.fromMillis(lastMeasurements.measurementDate);
    }
    let days = 0;
    if (childBirthDay) {
        const date = DateTime.fromISO(childBirthDay);
        const convertInDays = measurementDate.diff(date, "days").days;
        if (convertInDays !== undefined) {days = Math.round(convertInDays)}
    }
   
    const filteredData = chartData.find((data:any) => data.name == days);
    const allinterpretationData = useAppSelector(
        (state: any) =>
            JSON.parse(state.utilsData.height_for_age),
    );
    const interpretationData = allinterpretationData?.find((item:any) => item.child_age.indexOf(childAgeId ? childAgeId : 0) !== -1);
     if (filteredData !== undefined) {
        if (length >= filteredData.sd2neg && length <= filteredData.sd3) {
            interpretationText = interpretationData?.goodText;
            goodMeasure = true;
        }
        if (length < filteredData.sd2neg && length > filteredData.sd3neg) {
            interpretationText = interpretationData?.warrningSmallLengthText;
        }

        if (length < filteredData.sd3neg) {
            interpretationText = interpretationData?.emergencySmallLengthText;
        }
        if (length > filteredData.sd3) {
            interpretationText = interpretationData?.warrningBigLengthText;
        }
    }
    if (interpretationText && interpretationText.name === "") {
        goodMeasure = undefined
    }

    return {
        interpretationText: interpretationText,
        goodMeasure: goodMeasure
    };
};