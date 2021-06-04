import React, { useContext, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useAppDispatch } from "../../../App";
import { setChildStore } from "../../redux/reducers/localizationSlice";
import { ChildEntity, ChildEntitySchema } from '../schema/childDataSchema';
import { userRealmCommon } from './userRealmCommon';


const useRealmListener = () => {
// //     console.log("in dispatchchildstore");
//      const  userRealmListener= (childobj: any) => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        async function fetchData() {
            let objdata = await userRealmCommon.getData<ChildEntity>(ChildEntitySchema);
            console.log("objdata in listen--",objdata);
            objdata.addListener(() => dispatch(setChildStore(JSON.stringify(objdata))));
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