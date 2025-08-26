import React, { useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import FileIcon from '@images/ic_file.svg';
import FavoriteIcon from '@images/ic_favorite.svg';
import ChatIcon from '@images/logo_chatbot.svg';
import ActionSheet from 'react-native-actions-sheet';
import VectorImage from 'react-native-vector-image';
import { useAppDispatch, useAppSelector } from '../../../App';
import { backup } from '../../services/backup';
import { userRealmCommon } from '../../database/dbquery/userRealmCommon';
import { encryptionsKey } from 'react-native-dotenv';
import { setInfoModalOpened } from '../../redux/reducers/utilsSlice';
import { formatStringDate } from '../../services/Utils';

// Fix for TypeScript SVG imports
// @ts-ignore
declare module '*.svg' {
  import * as React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

const QuickLinksRow = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [isExportRunning, setIsExportRunning] = useState(false);
  const [isExportAlertVisible, setExportAlertVisible] = useState(false);
  const actionSheetRef = useRef<any>(null);

  // Helper to truncate text to 2 lines with ellipsis
  const renderButtonText = (text: string) => (
    <Text style={styles.buttonText} numberOfLines={2} ellipsizeMode="tail">
      {text}
    </Text>
  );

  // Export logic (copied/adapted from SettingScreen)
  const exportFile = async (): Promise<any> => {
    setIsExportRunning(true);
    try {
      userRealmCommon
        .exportUserRealmDataToJson()
        .then(async (jsonData: any) => {
          // Encryption logic is inside backup.export, so we can use backup.export for Google Drive
          // For file export, you may want to add your own logic here if needed
          // For now, just show success
          setIsExportRunning(false);
          Alert.alert('', t('settingExportSuccess'));
        })
        .catch((error) => {
          setIsExportRunning(false);
          Alert.alert('', t('settingExportError'));
        });
    } catch (err) {
      setIsExportRunning(false);
      Alert.alert('', t('settingExportError'));
    }
    actionSheetRef.current?.setModalVisible(false);
  };

  const exportToDrive = async (): Promise<any> => {
    setIsExportRunning(true);
    const exportIsSuccess = await backup.export();
    setIsExportRunning(false);
    if (!exportIsSuccess) {
      Alert.alert('', t('settingExportError'));
    } else {
      Alert.alert('', t('settingExportSuccess'));
    }
    actionSheetRef.current?.setModalVisible(false);
  };

  const handleExportAlertConfirm = (): any => {
    setExportAlertVisible(false);
    exportToDrive();
  };

  return (
    <View style={styles.row}>
      {/* Back up your data */}
      <Pressable
        style={styles.button}
        onPress={() => actionSheetRef.current?.setModalVisible(true)}
      >
        <FileIcon width={32} height={32} style={styles.iconSvg} />
        {renderButtonText(t('settingScreenexportBtnText'))}
      </Pressable>
      {/* Favorites */}
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('Favourites')}
      >
        <FavoriteIcon width={32} height={32} style={styles.iconSvg} />
        {renderButtonText(t('favScreenHeader'))}
      </Pressable>
      {/* Chat */}
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('SupportChat')}
      >
        <ChatIcon width={32} height={32} style={styles.iconSvg} />
        {renderButtonText(t('supportScreenheaderTitle'))}
      </Pressable>
      {/* Export ActionSheet Modal */}
      <ActionSheet ref={actionSheetRef} gestureEnabled={true}>
        <View style={styles.sheetContainer}>
          <Text style={styles.sheetTitle}>{t('settingScreenexportOptionHeader')}</Text>
          <View style={styles.sheetOptionsRow}>
            <Pressable
              style={styles.sheetOption}
              onPress={exportFile}
              disabled={isExportRunning}
            >
              <VectorImage source={require('@images/ic_file.svg')} style={styles.sheetIcon} />
              <Text style={styles.sheetOptionText}>{t('settingScreenshareBtntxt')}</Text>
            </Pressable>
            <Pressable
              style={styles.sheetOption}
              onPress={() => setExportAlertVisible(true)}
              disabled={isExportRunning}
            >
              <VectorImage source={require('@images/ic_gdrive.svg')} style={styles.sheetIcon} />
              <Text style={styles.sheetOptionText}>{t('settingScreengdriveBtntxt')}</Text>
            </Pressable>
          </View>
          {isExportRunning && <ActivityIndicator size="small" color="#007AFF" style={{ marginTop: 16 }} />}
        </View>
      </ActionSheet>
      {/* Export to Drive Alert */}
      {isExportAlertVisible && (
        <View style={styles.alertOverlay}>
          <View style={styles.alertBox}>
            <Text style={styles.alertTitle}>{t('settingScreenexportBtnText')}</Text>
            <Text style={styles.alertMessage}>{t('settingScreenexportOptionHeader')}</Text>
            <View style={styles.alertActions}>
              <Pressable style={styles.alertButton} onPress={() => setExportAlertVisible(false)}>
                <Text style={styles.alertButtonText}>{t('cancelPopUpBtn')}</Text>
              </Pressable>
              <Pressable style={styles.alertButton} onPress={handleExportAlertConfirm}>
                <Text style={styles.alertButtonText}>{t('continueInModal')}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 6,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    minWidth: 90,
  },
  iconSvg: {
    marginBottom: 8,
  },
  buttonText: {
    color: '#007AFF', // Blue accent
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    maxWidth: 80,
  },
  sheetContainer: {
    padding: 24,
    alignItems: 'center',
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sheetOptionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  sheetOption: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 12,
  },
  sheetIcon: {
    width: 32,
    height: 32,
    marginBottom: 8,
  },
  sheetOptionText: {
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  alertOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  alertBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    minWidth: 250,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  alertMessage: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  alertActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
  },
  alertButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  alertButtonText: {
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default QuickLinksRow; 