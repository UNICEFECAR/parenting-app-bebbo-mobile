import { all, call, fork, takeEvery } from "redux-saga/effects";
import { addApiDataInRealm } from "../../services/Utils";
import { INSERT_IN_DB } from "./sagaActions";

// export default function* rootSaga() {
//     console.log("called rootSaga");
//     yield all([InsertInDBSaga()]);
// }
function* onInsertInDB(response:any) {
   // console.log("action called insert");
    try{
        yield fork(addApiDataInRealm, response);
      }
      catch(e) {
       // console.log("in onInsertInDB err ", e);
      }
}

export function* InsertInDBSaga() {
   // console.log("called InsertInDBSaga");
    yield takeEvery(INSERT_IN_DB, onInsertInDB);
  }

  