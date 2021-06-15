import React, { useContext, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useAppDispatch } from "../../../App";
import { setChildStore } from "../../redux/reducers/localizationSlice";
import { setAllTaxonomyData } from '../../redux/reducers/utilsSlice';
import { ChildEntity, ChildEntitySchema } from '../schema/childDataSchema';
import { TaxonomyEntity, TaxonomySchema } from '../schema/TaxonomySchema';
import { dataRealmCommon } from './dataRealmCommon';
import { userRealmCommon } from './userRealmCommon';


const useRealmListener = () => {
// //     console.log("in dispatchchildstore");
//      const  userRealmListener= (childobj: any) => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        async function fetchData() {
            let objdata = await userRealmCommon.getData<ChildEntity>(ChildEntitySchema);
            objdata.addListener(() => dispatch(setChildStore(JSON.stringify(objdata))));
            let taxonomyData2 = await dataRealmCommon.getData<TaxonomyEntity>(TaxonomySchema);
            taxonomyData2.addListener(() => dispatch(setAllTaxonomyData(taxonomyData2)));

        }
        fetchData()
    },[])
        
//     }
//     // export const dispatchchildstore2 = (childobj) => {
//     //     // const dispatch = useAppDispatch();
//     //     // dispatch(setChildStore(childobj));
//     //     console.log("no dispatch");
//     // }
}
export default useRealmListener;
// const dispatchchildstore=(objdata:any)=>{
//     // const dispatch = useAppDispatch();
//     console.log("in listener");
// }
// export default dispatchchildstore;