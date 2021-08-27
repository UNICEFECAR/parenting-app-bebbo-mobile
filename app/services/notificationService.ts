import { useAppSelector } from "../../App";

export const getAllNotifications = () => {
    const activeChild = useAppSelector((state: any) =>
      state.childData.childDataSet.activeChild != ''
        ? JSON.parse(state.childData.childDataSet.activeChild)
        : [],
    );
    console.log(activeChild)
    console.log(activeChild.taxonomyData)

}