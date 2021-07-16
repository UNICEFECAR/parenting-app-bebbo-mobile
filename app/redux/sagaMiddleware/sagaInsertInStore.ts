import getAllDataToStore from "@assets/translations/appOfflineData/getDataToStore";
import { all, call, takeEvery } from "redux-saga/effects";
import { INSERT_IN_STORE } from "./sagaActions";

// export default function* rootSaga() {
//     console.log("called rootSaga");
//     yield all([InsertInDBSaga()]);
// }
function* onInsertInStore(response:any) {
   // console.log("action called insert");
    try{
        yield call(getAllDataToStore, response.languageCode,response.dispatch,response.payload.apiEndpoint)
      }
      catch(e) {
       // console.log("in onInsertInDB err ", e);
      }
}

export function* InsertInStoreSaga() {
   // console.log("called InsertInDBSaga");
    yield takeEvery(INSERT_IN_STORE, onInsertInStore);
  }

  