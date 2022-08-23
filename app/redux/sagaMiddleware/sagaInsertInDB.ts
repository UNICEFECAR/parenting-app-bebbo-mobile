import { fork, takeEvery } from "redux-saga/effects";
import { addApiDataInRealm } from "../../services/Utils";
import { INSERT_IN_DB } from "./sagaActions";

function* onInsertInDB(response:any) {
    try{
        yield fork(addApiDataInRealm, response);
      }
      catch(e) {
       // console.log("in onInsertInDB err ", e);
      }
}

export function* InsertInDBSaga() {
    yield takeEvery(INSERT_IN_DB, onInsertInDB);
  }

  