import { appConfig } from './../types/apiConstants';
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
NetInfo.configure({
    reachabilityUrl: appConfig.articles,
    reachabilityTest: async (response) => response.status === 204,
    reachabilityLongTimeout: 60 * 1000, // 60s
    reachabilityShortTimeout: 5 * 1000, // 5s
    reachabilityRequestTimeout: 15 * 1000, // 15s
});
const netInfo=()=>{
// const netInfo = useNetInfo();
// return netInfo;
}
// Subscribe

export default netInfo;