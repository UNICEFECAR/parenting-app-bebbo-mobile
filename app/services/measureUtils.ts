import { DateTime } from "luxon";
import { MeasuresEntity } from "../database/schema/ChildDataSchema";


export const isGrowthMeasureExistForDate = (selectedMeasureDate:any,activeChild:any):any => {
    const filteredMeasures = activeChild?.measures.filter((measure: MeasuresEntity) => {
        return Math.round(DateTime.fromMillis(measure.measurementDate).diff((selectedMeasureDate), "days").days) == 0 && measure.isChildMeasured == true
    })
    return filteredMeasures.length > 0 ? true : false
}
export const isVaccineMeasureExistForDate = (selectedMeasureDate:any,activeChild:any):any => {
    const filteredMeasures = activeChild?.measures.filter((measure: MeasuresEntity) => {
        return Math.round(DateTime.fromMillis(measure.measurementDate).diff((selectedMeasureDate), "days").days) == 0 && measure.didChildGetVaccines == true
    })
    return filteredMeasures.length > 0 ? true : false
}
export const isAnyMeasureExistForDate = (selectedMeasureDate:any,activeChild:any):any => {
    const filteredMeasures = activeChild?.measures.filter((measure: MeasuresEntity) => {
        return Math.round(DateTime.fromMillis(measure.measurementDate).diff((selectedMeasureDate), "days").days) == 0
    })
    return filteredMeasures.length > 0 ? true : false
}

export const getMeasuresForDate = (measureDate:any,activeChild:any):any=>{
  return  activeChild?.measures.find((measureitem:any)=>Math.round(DateTime.fromMillis(measureitem.measurementDate).diff((measureDate), "days").days) == 0 )
}
