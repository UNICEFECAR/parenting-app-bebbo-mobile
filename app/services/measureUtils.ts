import { DateTime } from "luxon";
import { useAppSelector } from "../../App";
import { MeasuresEntity } from "../database/schema/ChildDataSchema";


export const isGrowthMeasureExistForDate = (selectedMeasureDate,activeChild) => {
    const filteredMeasures = activeChild?.measures.filter((measure: MeasuresEntity) => {
        console.log(Math.round(DateTime.fromMillis(measure.measurementDate).diff((selectedMeasureDate), "days").days) == 0)
        return Math.round(DateTime.fromMillis(measure.measurementDate).diff((selectedMeasureDate), "days").days) == 0 && measure.isChildMeasured == true
    })
    console.log(filteredMeasures,"filteredMeasures")
    return filteredMeasures.length > 0 ? true : false
}
export const isVaccineMeasureExistForDate = (selectedMeasureDate,activeChild) => {
    const filteredMeasures = activeChild?.measures.filter((measure: MeasuresEntity) => {
        return Math.round(DateTime.fromMillis(measure.measurementDate).diff((selectedMeasureDate), "days").days) == 0 && measure.didChildGetVaccines == true
    })
    return filteredMeasures.length > 0 ? true : false
}
export const getMeasuresForDate = (measureDate,activeChild)=>{
  return  activeChild?.measures.find(measureitem=>Math.round(DateTime.fromMillis(measureitem.measurementDate).diff((measureDate), "days").days) == 0 )
}
