import React, {useState} from 'react';
import {View, Text, Pressable, ActivityIndicator, ScrollView} from 'react-native';
import {useTranslation} from 'react-i18next';
import {recoverPendingBackup} from '../services/backupRecovery';
export default function BackupRecoveryScreen({onComplete}: {onComplete: () => void}) {
  const {t} = useTranslation(), [busy,setBusy] = useState(false);
  const run = async (rollback: boolean) => {setBusy(true); try {await recoverPendingBackup(rollback);onComplete();} catch {setBusy(false);}};
  return <ScrollView contentContainerStyle={{flexGrow:1,padding:24,backgroundColor:'white',justifyContent:'center'}}>
    <Text allowFontScaling style={{fontSize:22,color:'#111'}}>{String(t('backupRecoveryTitle',{defaultValue:'Finish interrupted restore'}))}</Text>
    <Text allowFontScaling style={{color:'#111',fontSize:18}}>{String(t('backupRecoveryHelp',{defaultValue:'The restore did not finish. Free some storage if necessary, then retry. You can also keep the data that was on this device before the restore. The app will remain here until recovery finishes.'}))}</Text>
    {busy ? <ActivityIndicator/> : <View>
      <Pressable accessibilityRole="button" style={{padding:20}} onPress={()=>{void run(false);}}><Text allowFontScaling style={{color:'#111',fontSize:18}}>{String(t('tryText',{defaultValue:'Retry'}))}</Text></Pressable>
      <Pressable accessibilityRole="button" style={{padding:20}} onPress={()=>{void run(true);}}><Text allowFontScaling style={{color:'#111',fontSize:18}}>{String(t('backupKeepPrevious',{defaultValue:'Keep previous data'}))}</Text></Pressable>
    </View>}
  </ScrollView>;
}
