import React, { useEffect } from 'react';
import { useAppDispatch } from "../../../App";


const useRealmListener = () => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        async function fetchData() {
            console.log("in func");
        }
        fetchData()
    },[])
}
export default useRealmListener;