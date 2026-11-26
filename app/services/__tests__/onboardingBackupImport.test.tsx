import React from 'react';
import TestRenderer, {act} from 'react-test-renderer';
import {Alert, BackHandler} from 'react-native';
import ChildImportSetup from '../../screens/ChildImportSetup';
import {ButtonPrimary, ButtonWithBorder} from '../../components/shared/ButtonGlobal';
import {holdBackupPreview, getBackupPreview, clearBackupPreviews} from '../backupPreview';
import {backup} from '../backup';
import {notiPermissionUtil} from '../Utils';
import {confirmBackupReplacement} from '../confirmBackupReplacement';
import {ThemeProvider} from 'styled-components/native';
import {appTheme} from '../../instances/bebbo/styles/theme';

jest.mock('../../../App',()=>({useAppDispatch:()=>jest.fn(),useAppSelector:(selector:any)=>selector({utilsData:{taxonomyIds:{}},selectedCountry:{languageCode:'en'}})}));
jest.mock('../selectors',()=>({selectChildGenders:()=>[],selectChildAge:()=>[],selectParentGender:()=>[],selectRelationshipToParent:()=>[]}));
jest.mock('../../instances',()=>({appConfig:{}}));
jest.mock('../backup',()=>({backup:{restoreChildren:jest.fn()}}));
jest.mock('../Utils',()=>({notiPermissionUtil:jest.fn()}));
jest.mock('../confirmBackupReplacement',()=>({confirmBackupReplacement:jest.fn()}));
jest.mock('../firebaseAnalytics',()=>({recordError:jest.fn()}));
jest.mock('../EventSyncService',()=>({logEvent:jest.fn()}));
jest.mock('../childCRUD',()=>({getAllChildren:jest.fn(),setActiveChild:jest.fn(),apiJsonDataGet:()=>[]}));
jest.mock('../../database/dbquery/dataRealmCommon',()=>({dataRealmCommon:{getFilteredData:jest.fn().mockResolvedValue([])}}));
jest.mock('../../redux/reducers/utilsSlice',()=>({setInfoModalOpened:jest.fn()}));
jest.mock('../../redux/reducers/notificationSlice',()=>({setAllLocalNotificationGenerateType:jest.fn()}));
jest.mock('../../customHooks/useNetInfoHook',()=>({__esModule:true,default:()=>({isConnected:true})}));
jest.mock('../../components/FocusAwareStatusBar',()=>()=>null);
jest.mock('../../components/shared/Icon',()=>({__esModule:true,default:()=>null}));
jest.mock('../../components/ToggleRadios',()=>()=>null);
jest.mock('../../components/shared/TextInputML',()=>()=>null);
jest.mock('../../components/shared/AppActionSheet',()=>()=>null);
jest.mock('react-i18next',()=>({useTranslation:()=>({t:(key:string)=>key})}));
jest.mock('@react-navigation/native',()=>({
 CommonActions:{reset:(state:any)=>state},
 useFocusEffect:(callback:any)=>require('react').useEffect(callback,[callback]),
}));

let view:TestRenderer.ReactTestRenderer;
let navigation:any;
let hardwareBack:()=>boolean;
const children=[{uuid:'legacy-child'}];
beforeEach(()=>{
 jest.clearAllMocks();
 jest.spyOn(Alert,'alert').mockImplementation(()=>{});
 jest.spyOn(BackHandler,'addEventListener').mockImplementation((_event,callback:any)=>{hardwareBack=callback;return {remove:jest.fn()};});
 navigation={canGoBack:jest.fn().mockReturnValue(true),goBack:jest.fn(),replace:jest.fn(),reset:jest.fn(),dispatch:jest.fn()};
 jest.mocked(confirmBackupReplacement).mockResolvedValue(true);
 jest.mocked(backup.restoreChildren).mockResolvedValue(children);
});
afterEach(()=>{act(()=>view?.unmount());clearBackupPreviews();jest.restoreAllMocks();});
function render(previewId=holdBackupPreview(children)) {
 act(()=>{view=TestRenderer.create(<ThemeProvider theme={appTheme}><ChildImportSetup navigation={navigation} route={{params:{
  importPreviewId:previewId,parentName:'Caregiver',relationData:'female',userRelationToParentData:'mother',
 }}}/></ThemeProvider>);});
 return previewId;
}
const continueImport=()=>view.root.findByType(ButtonPrimary).props.onPress();

test('legacy onboarding preview survives until commit and notification permission is deferred',async()=>{
 const id=render();
 expect(notiPermissionUtil).not.toHaveBeenCalled();
 expect(getBackupPreview(id)).toBe(children);
 jest.mocked(backup.restoreChildren).mockImplementationOnce(async(data:any)=>{
  expect(getBackupPreview(id)).toBe(data);
  expect(notiPermissionUtil).not.toHaveBeenCalled();
  return children;
 });
 await act(async()=>{await continueImport();});
 expect(backup.restoreChildren).toHaveBeenCalledWith(children,[],expect.objectContaining({userName:'Caregiver',userParentalRole:'female'}));
 expect(notiPermissionUtil).toHaveBeenCalledTimes(1);
 expect(()=>getBackupPreview(id)).toThrow('expired');
 expect(navigation.reset).toHaveBeenCalledWith(expect.objectContaining({routes:[expect.objectContaining({name:'LoadingScreen'})]}));
});
test('a preview cleared after selection offers a working retry instead of trapping onboarding',async()=>{
 render();clearBackupPreviews();
 await act(async()=>{await continueImport();});
 expect(backup.restoreChildren).not.toHaveBeenCalled();
 expect(confirmBackupReplacement).not.toHaveBeenCalled();
 const alert=jest.mocked(Alert.alert).mock.calls.at(-1)!;
 expect(alert[1]).toBe('backupPreviewExpired');
 act(()=>alert[2]![0].onPress!());
 expect(navigation.goBack).toHaveBeenCalledTimes(1);
});
test('an already expired route can restart selection even without a back stack',()=>{
 navigation.canGoBack.mockReturnValue(false);
 render('missing-preview');
 const alert=jest.mocked(Alert.alert).mock.calls.at(-1)!;
 act(()=>alert[2]![0].onPress!());
 expect(navigation.replace).toHaveBeenCalledWith('ChildSetup');
 expect(backup.restoreChildren).not.toHaveBeenCalled();
});
test('leaving the app during replacement confirmation cannot restore a cleared preview',async()=>{
 render();
 jest.mocked(confirmBackupReplacement).mockImplementationOnce(async()=>{clearBackupPreviews();return true;});
 await act(async()=>{await continueImport();});
 expect(backup.restoreChildren).not.toHaveBeenCalled();
 expect(jest.mocked(Alert.alert).mock.calls.at(-1)![1]).toBe('backupPreviewExpired');
});
test('portable previews still restore caregiver details from the new backup format',async()=>{
 const snapshot={children,settings:{userName:'Saved caregiver',userParentalRole:'male',userRelationToParent:'father'}};
 render(holdBackupPreview(snapshot));
 await act(async()=>{await continueImport();});
 expect(backup.restoreChildren).toHaveBeenCalledWith(snapshot,[],expect.objectContaining({userName:'Saved caregiver',userParentalRole:'male',userRelationToParent:'father'}));
 expect(navigation.reset).toHaveBeenCalledTimes(1);
});
test('Cancel discards only the preview and returns without modifying data',()=>{
 const id=render();
 act(()=>view.root.findByType(ButtonWithBorder).props.onPress());
 expect(navigation.goBack).toHaveBeenCalledTimes(1);
 expect(()=>getBackupPreview(id)).toThrow('expired');
 expect(backup.restoreChildren).not.toHaveBeenCalled();
});
test('Back is available before restore but blocked while a restore is committing',async()=>{
 render();
 act(()=>{hardwareBack();});
 expect(navigation.goBack).toHaveBeenCalledTimes(1);
 act(()=>view.unmount());
 render();navigation.goBack.mockClear();
 let finish!:(data:any)=>void;
 jest.mocked(backup.restoreChildren).mockReturnValueOnce(new Promise(resolve=>{finish=resolve;}));
 let pending:Promise<void>;
 await act(async()=>{pending=continueImport();await Promise.resolve();});
 act(()=>{hardwareBack();});
 expect(navigation.goBack).not.toHaveBeenCalled();
 await act(async()=>{finish(children);await pending!;});
});
