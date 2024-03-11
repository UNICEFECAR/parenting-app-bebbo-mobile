import { bgcolorWhite2, overlaymodalBackground } from '@styles/style';
import React, { useContext } from 'react';
import {StyleSheet, View, Modal, ActivityIndicator} from 'react-native';
import { ThemeContext } from 'styled-components/native';
const styles = StyleSheet.create({
  activityIndicatorWrapper: {
    alignItems: 'center',
    backgroundColor: bgcolorWhite2,
    borderRadius: 10,
    display: 'flex',
    height: 100,
    justifyContent: 'space-around',
    width: 100,
  },
  modalBackground: {
    alignItems: 'center',
    backgroundColor: overlaymodalBackground,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
  }
 
});

const OverlayLoadingComponent = (props: any):any =>{
  const {loading} = props;
  const themeContext = useContext(ThemeContext);
   return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={loading}
      onRequestClose={():any => {
        console.log("request to close called");
      }}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator size="large" color={themeContext?.colors.PRIMARY_TEXTCOLOR} animating={loading} />
        </View>
      </View>
    </Modal>
  );
};

 


 

export default OverlayLoadingComponent;