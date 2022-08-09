import { bgcolorWhite2, overlaymodalBackground } from '@styles/style';
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
  activityIndicatorWrapper: {
    backgroundColor: bgcolorWhite2,
    borderRadius: 10,
    height: 100,
    width: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  modalBackground: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: overlaymodalBackground,
  }
 
});

 

export default OverlayLoadingComponent;