import { useNetInfo } from "@react-native-community/netinfo";

const ImageStorage=(response:any)=>{
    const netInfo = useNetInfo();
    console.log(netInfo,"..netInfo..");
    console.log(response,"..response..");
}
export default ImageStorage;