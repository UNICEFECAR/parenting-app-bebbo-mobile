import { useNetInfo } from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

const useNetInfoHook = ():any => {
    const netInfo = useNetInfo();
    return {
      isConnected: netInfo.isConnected,
      netValue: {
        type: netInfo.type,
        details: netInfo.details,
        isConnected: netInfo.isConnected,
        isReachable: netInfo.isInternetReachable,
      },
      netType: netInfo.type,
      isResolved:
        netInfo.isConnected !== null &&
        netInfo.isConnected !== undefined,
    };
}

export default useNetInfoHook;