import React, { useContext } from 'react';
import {StyleSheet, View, Modal, ActivityIndicator} from 'react-native';
import { ThemeContext } from 'styled-components/native';

const OverlayLoadingComponent = (props: any) =>{
  const {loading} = props;
  const themeContext = useContext(ThemeContext);

  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={loading}
      onRequestClose={() => {
        console.log('close modal');
      }}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator size="large" color={themeContext.colors.PRIMARY_TEXTCOLOR} animating={loading} />
        </View>
      </View>
    </Modal>
  );
};

 

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

 

export default OverlayLoadingComponent;