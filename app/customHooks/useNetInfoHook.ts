import { useNetInfo } from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

const useNetInfoHook = () => {
    const [isConnected, setIsConnected] = useState<boolean | null>(null);
    const [netValue, setNetValue] = useState<any>(null);
    const [netType, setNetType] = useState<any>(null);
    // const [netInfoVal, setNetInfoVal] = useState<any | null>(null);

    // Use the builtin library hook and update our own value when it changes
    const netInfo = useNetInfo();
    useEffect(() => {
      if(netInfo && netInfo.isConnected!=null){
      setIsConnected(netInfo.isConnected);
      setNetType(netInfo.type);
      setNetValue({
        type:netInfo.type,
        //effectiveType:netInfo.effectiveType,
        details:netInfo.details,
        isConnected:netInfo.isConnected,
        isReachable:netInfo.isInternetReachable
      })
    }
    //   setNetInfoVal(netInfo);
    }, [netInfo]);
  
    return {isConnected,netValue,netType};
}

export default useNetInfoHook;