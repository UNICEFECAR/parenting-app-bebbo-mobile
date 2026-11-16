import React from 'react';
import TestRenderer,{act} from 'react-test-renderer';
import BackupRecoveryScreen from '../../components/BackupRecoveryScreen';
import {recoverPendingBackup} from '../backupRecovery';
jest.mock('../backupRecovery',()=>({recoverPendingBackup:jest.fn()}));
jest.mock('react-i18next',()=>({useTranslation:()=>({t:(_key:string,options:any)=>options.defaultValue})}));
let view:TestRenderer.ReactTestRenderer;
afterEach(()=>{act(()=>view?.unmount());jest.clearAllMocks();});
test('simultaneous retry and rollback taps start only the first recovery choice',async()=>{
 let finish!:()=>void;const pending=new Promise<void>(resolve=>{finish=resolve;});
 jest.mocked(recoverPendingBackup).mockReturnValue(pending);const complete=jest.fn();
 act(()=>{view=TestRenderer.create(<BackupRecoveryScreen onComplete={complete}/>);});
 const buttons=view.root.findAll(node=>node.props.accessibilityRole==='button' && typeof node.props.onPress==='function');
 act(()=>{buttons[0].props.onPress();buttons[1].props.onPress();});
 expect(recoverPendingBackup).toHaveBeenCalledTimes(1);expect(recoverPendingBackup).toHaveBeenCalledWith(false);
 await act(async()=>{finish();await pending;});expect(complete).toHaveBeenCalledTimes(1);
});
test('a failed recovery releases the tap guard for an explicit rollback',async()=>{
 jest.mocked(recoverPendingBackup).mockRejectedValueOnce(new Error('disk full')).mockResolvedValueOnce(undefined);const complete=jest.fn();
 act(()=>{view=TestRenderer.create(<BackupRecoveryScreen onComplete={complete}/>);});
 await act(async()=>{view.root.findAll(node=>node.props.accessibilityRole==='button' && typeof node.props.onPress==='function')[0].props.onPress();});
 expect(complete).not.toHaveBeenCalled();
 await act(async()=>{view.root.findAll(node=>node.props.accessibilityRole==='button' && typeof node.props.onPress==='function')[1].props.onPress();});
 expect(recoverPendingBackup).toHaveBeenLastCalledWith(true);expect(complete).toHaveBeenCalledTimes(1);
});
