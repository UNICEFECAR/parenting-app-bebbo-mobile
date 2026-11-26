import React from 'react';
import TestRenderer,{act} from 'react-test-renderer';
import {AppState, TextInput, Modal, ActivityIndicator} from 'react-native';
import BackupPasswordPrompt from '../../components/BackupPasswordPrompt';
import {requestBackupPassword, setBackupOperationBusy} from '../backupPassword';
import {getBackupPreview, holdBackupPreview, clearBackupPreviews} from '../backupPreview';
import {useBackupOperationBusy} from '../../customHooks/useBackupOperationBusy';
import OverlayLoadingComponent from '../../components/OverlayLoadingComponent';
jest.mock('react-i18next',()=>({useTranslation:()=>({t:(_key:string,options:any)=>options?.defaultValue||_key})}));
jest.mock('react-native-aes-crypto',()=>({}));
let view:TestRenderer.ReactTestRenderer,change:(value:string)=>void;
beforeEach(()=>{jest.spyOn(AppState,'addEventListener').mockImplementation((_type,handler:any)=>{change=handler;return {remove:jest.fn()};});act(()=>{view=TestRenderer.create(<BackupPasswordPrompt/>);});});
afterEach(()=>{act(()=>view.unmount());setBackupOperationBusy(false);clearBackupPreviews();jest.restoreAllMocks();});
test('export requires a matching passphrase, then clears both fields',async()=>{
 let result:Promise<string|null>;act(()=>{result=requestBackupPassword('create');});
 const fields=view.root.findAllByType(TextInput);expect(fields).toHaveLength(2);expect(fields.every(f=>f.props.secureTextEntry&&f.props.autoCorrect===false)).toBe(true);
 const confirm=()=>view.root.findAllByProps({testID:'backup-passphrase-continue'})[0];expect(confirm().props.disabled).toBe(true);
 act(()=>{fields[0].props.onChangeText('several separate words');fields[1].props.onChangeText('wrong words');});expect(confirm().props.disabled).toBe(true);
 act(()=>fields[1].props.onChangeText('several separate words'));expect(confirm().props.disabled).toBe(false);act(()=>confirm().props.onPress());act(()=>view.root.findByType(Modal).props.onDismiss());await expect(result!).resolves.toBe('several separate words');
 expect(view.root.findByType(Modal).props.visible).toBe(false);expect(view.root.findAllByType(TextInput).every(f=>f.props.value==='')).toBe(true);
});
test('backgrounding cancels the prompt and clears secrets',async()=>{
 let result:Promise<string|null>;act(()=>{result=requestBackupPassword('unlock');});act(()=>view.root.findByType(TextInput).props.onChangeText('private test passphrase'));act(()=>change('background'));act(()=>view.root.findByType(Modal).props.onDismiss());await expect(result!).resolves.toBeNull();expect(view.root.findByType(Modal).props.visible).toBe(false);
});
test('a system dialog preserves a legacy preview, but leaving the app clears it',()=>{
 const children=[{uuid:'legacy-child'}];const id=holdBackupPreview(children);
 act(()=>change('inactive'));
 expect(getBackupPreview(id)).toBe(children);
 act(()=>change('active'));
 expect(getBackupPreview(id)).toBe(children);
 act(()=>change('background'));
 expect(()=>getBackupPreview(id)).toThrow('expired');
});
test('screen and global backup loaders display one spinner across the busy handoff',()=>{
 const ScreenLoader=()=>{
  const busy=useBackupOperationBusy();
  return <OverlayLoadingComponent loading={!busy}/>;
 };
 act(()=>view.update(<><ScreenLoader/><BackupPasswordPrompt/></>));
 expect(view.root.findAllByType(ActivityIndicator)).toHaveLength(1);
 act(()=>setBackupOperationBusy(true));
 expect(view.root.findAllByType(ActivityIndicator)).toHaveLength(1);
 act(()=>setBackupOperationBusy(false));
 expect(view.root.findAllByType(ActivityIndicator)).toHaveLength(1);
});
test('text inputs retain system font scaling',()=>{act(()=>{void requestBackupPassword('create');});for(const input of view.root.findAllByType(TextInput))expect(input.props.allowFontScaling).not.toBe(false);});
test('unlock permits an existing short normalised passphrase while creation requires six characters',()=>{
 act(()=>{void requestBackupPassword('unlock');});
 act(()=>view.root.findByType(TextInput).props.onChangeText('é'.repeat(5)));
 expect(view.root.findAllByProps({testID:'backup-passphrase-continue'})[0].props.disabled).toBe(false);
 act(()=>{void requestBackupPassword('create');});
 act(()=>{for(const input of view.root.findAllByType(TextInput))input.props.onChangeText('e\u0301'.repeat(5));});
 expect(view.root.findAllByProps({testID:'backup-passphrase-continue'})[0].props.disabled).toBe(true);
 act(()=>{for(const input of view.root.findAllByType(TextInput))input.props.onChangeText('e\u0301'.repeat(6));});
 expect(view.root.findAllByProps({testID:'backup-passphrase-continue'})[0].props.disabled).toBe(false);
});
