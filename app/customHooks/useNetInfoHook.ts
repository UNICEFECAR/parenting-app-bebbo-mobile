import { useNetInfo } from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

const useNetInfoHook = () => {
    const [isConnected, setIsConnected] = useState<boolean | null>(null);
    // const [netInfoVal, setNetInfoVal] = useState<any | null>(null);

    // Use the builtin library hook and update our own value when it changes
    const netInfo = useNetInfo();
    useEffect(() => {
      setIsConnected(netInfo.isConnected);
    //   setNetInfoVal(netInfo);
    }, [netInfo]);
  
    return isConnected;
}

export default useNetInfoHook;