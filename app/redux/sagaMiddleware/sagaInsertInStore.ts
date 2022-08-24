import getAllDataToStore from "@assets/translations/appOfflineData/getDataToStore";
import { call, takeEvery } from "redux-saga/effects";
import { INSERT_IN_STORE } from "./sagaActions";

function* onInsertInStore(response:any):any {
    try{
        yield call(getAllDataToStore, response.languageCode,response.dispatch,response.payload.apiEndpoint)
      }
      catch(e) {
       // console.log("in onInsertInDB err ", e);
      }
}

export function* InsertInStoreSaga():any {
    yield takeEvery(INSERT_IN_STORE, onInsertInStore);
  }

  