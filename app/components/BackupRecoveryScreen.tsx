import React, {useRef, useState} from 'react';
import {View, Text, Pressable, ActivityIndicator, ScrollView} from 'react-native';
import {useTranslation} from 'react-i18next';
import {recoverPendingBackup} from '../services/backupRecovery';
export default function BackupRecoveryScreen({onComplete}: {onComplete: () => void}) {
  const {t} = useTranslation(), [busy,setBusy] = useState(false);
  const inFlight = useRef(false);
  const run = async (rollback: boolean) => {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    try {await recoverPendingBackup(rollback);onComplete();}
    catch {inFlight.current = false;setBusy(false);}
  };
  return <ScrollView contentContainerStyle={{flexGrow:1,padding:24,backgroundColor:'white',justifyContent:'center'}}>
    <Text allowFontScaling style={{fontSize:22,color:'#111'}}>{String(t('generalErrorTitle'))}</Text>
    <Text allowFontScaling style={{color:'#111',fontSize:18}}>{String(t('backupRecoveryHelp'))}</Text>
    {busy ? <ActivityIndicator/> : <View>
      <Pressable accessibilityRole="button" style={{padding:20}} onPress={()=>{void run(false);}}><Text allowFontScaling style={{color:'#111',fontSize:18}}>{String(t('retryRetryBtn'))}</Text></Pressable>
      <Pressable accessibilityRole="button" style={{padding:20}} onPress={()=>{void run(true);}}><Text allowFontScaling style={{color:'#111',fontSize:18}}>{String(t('backupKeepPrevious'))}</Text></Pressable>
    </View>}
  </ScrollView>;
}
