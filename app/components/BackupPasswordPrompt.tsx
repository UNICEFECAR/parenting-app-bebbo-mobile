import {clearBackupPreviews} from '../services/backupPreview';
import React, {useEffect, useRef, useState} from 'react';
import {AppState, Modal, View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, ActivityIndicator} from 'react-native';
import {useTranslation} from 'react-i18next';
import {BackupPasswordMode, installBackupPasswordHandler, subscribeBackupBusy} from '../services/backupPassword';
import {validBackupPassword} from '../services/protectedBackupCipher';
export default function BackupPasswordPrompt() {
  const {t} = useTranslation();
  const [busy, setBusy] = useState(false);
  useEffect(() => subscribeBackupBusy(setBusy), []);
  const [mode, setMode] = useState<BackupPasswordMode | null>(null);
  const [password, setPassword] = useState(''), [repeat, setRepeat] = useState('');
  const dismissed = useRef<(() => void) | null>(null);
  const resolver = useRef<((value: string | null) => void) | null>(null);
  const finish = (value: string | null) => {
    const resolve = resolver.current; if (!resolve) return; resolver.current = null;
    setPassword(''); setRepeat(''); setMode(null);
    if (Platform.OS === 'ios') dismissed.current = () => resolve?.(value);
    else resolve?.(value);
  };
  useEffect(() => {
    const uninstall = installBackupPasswordHandler(next => new Promise(resolve => {
      resolver.current?.(null); resolver.current = resolve;
      setPassword(''); setRepeat(''); setMode(next);
    }));
    const state = AppState.addEventListener('change', value => {if (value !== 'active') {finish(null);clearBackupPreviews();}});
    return () => {uninstall(); state.remove(); resolver.current?.(null); resolver.current = null; dismissed.current?.(); dismissed.current = null;};
  }, []);
  const label = (key: string, fallback: string) => String(t(key, {defaultValue: fallback}));
  const ready = validBackupPassword(password) && (mode !== 'create' || password === repeat);
  return <>{busy && <View style={[StyleSheet.absoluteFill, {backgroundColor:'#fff9',zIndex:99999,alignItems:'center',justifyContent:'center'}]}><ActivityIndicator size="large"/></View>}<Modal visible={mode !== null} transparent animationType="none" onDismiss={() => {const done=dismissed.current;dismissed.current=null;done?.();}} onRequestClose={() => finish(null)}>
    <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.card} accessibilityViewIsModal>
          <Text allowFontScaling style={styles.heading}>{label(mode === 'create' ? 'backupCreatePassphrase' : 'backupUnlockPassphrase', mode === 'create' ? 'Protect your backup' : 'Unlock your backup')}</Text>
          <Text allowFontScaling style={styles.copy}>{label('backupPassphraseHelp', 'Use several unrelated words (at least 12 characters). Keep it somewhere safe: it is not saved in the app and cannot be recovered. You will need it on another device. Older app versions cannot open new backups.')}</Text>
          <TextInput allowFontScaling testID="backup-passphrase-entry" style={styles.input} accessibilityLabel={label('backupPassphrase', 'Backup passphrase')} placeholder={label('backupPassphrase', 'Backup passphrase')} secureTextEntry autoCapitalize="none" autoCorrect={false} autoComplete="off" textContentType="none" maxLength={1024} value={password} onChangeText={setPassword}/>
          {mode === 'create' && <TextInput allowFontScaling testID="backup-passphrase-repeat" style={styles.input} accessibilityLabel={label('backupRepeatPassphrase', 'Repeat passphrase')} placeholder={label('backupRepeatPassphrase', 'Repeat passphrase')} secureTextEntry autoCapitalize="none" autoCorrect={false} autoComplete="off" textContentType="none" maxLength={1024} value={repeat} onChangeText={setRepeat}/>}
          <Pressable accessibilityRole="button" style={styles.button} onPress={() => finish(null)}><Text allowFontScaling style={styles.copy}>{label('retryCancelPopUpBtn', 'Cancel')}</Text></Pressable>
          <Pressable testID="backup-passphrase-continue" accessibilityRole="button" accessibilityState={{disabled: !ready}} disabled={!ready} style={[styles.button, !ready && styles.disabled]} onPress={() => finish(password)}><Text allowFontScaling style={styles.copy}>{label('continueInModal', 'Continue')}</Text></Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </Modal></>;
}
const styles = StyleSheet.create({overlay: {flex: 1, backgroundColor: '#0009'}, scroll: {flexGrow: 1, justifyContent: 'center', padding: 20}, card: {backgroundColor: 'white', padding: 20, borderRadius: 12}, copy: {color:'#111',fontSize:18}, heading: {color:'#111',fontSize: 22, marginBottom: 12}, input: {color:'#111',borderWidth: 1, borderColor: '#777', borderRadius: 6, marginTop: 16, padding: 12, fontSize: 18, textAlign: 'auto'}, button: {padding: 16, alignItems: 'center', marginTop: 12, backgroundColor: '#e6e6e6', borderRadius: 6}, disabled: {opacity: .4}});
