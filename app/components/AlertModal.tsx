import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { Heading1P, Heading3Center, Heading4RegularP } from '@styles/typography';
import React, { useContext } from 'react';
import {StyleSheet, View, Modal, ActivityIndicator, TouchableOpacity, Text} from 'react-native';
import VectorImage from 'react-native-vector-image';
import { ThemeContext } from 'styled-components/native';
import { ButtonColTwo4,ButtonColTwo6, ButtonContainerTwoP, ButtonLinkPress, ButtonModal, ButtonText, ButtonTextLinew } from './shared/ButtonGlobal';
import { FDirRow, FlexCol } from './shared/FlexBoxStyle';
import { ToolPress, ToolBoxText } from './shared/HomeScreenStyle';
import { OuterIconRow, OuterIconLeft } from './shared/Icon';
import { GoogleLogo } from './shared/LoadingStyle';

const AlertModal = (props: any) =>{
  const {loading,title,message,cancelText,onCancel,onConfirm,disabledValue} = props;
  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={loading}
      onRequestClose={() => {
        // console.log('close modal');
      }}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
        <View style={{flex:1}}>
        <Heading1P>{title}</Heading1P>
        <Heading4RegularP>{message}</Heading4RegularP>
        <ButtonContainerTwoP>
         <ButtonColTwo4>
        <TouchableOpacity onPress={onCancel}>
          <ButtonText  style={{color:"#000"}}>{cancelText}</ButtonText>
        </TouchableOpacity>
        </ButtonColTwo4>
        <ButtonColTwo6>
        <GoogleSigninButton
  style={{ width: '100%', height: 48 }}
  size={GoogleSigninButton.Size.Wide}
  color={GoogleSigninButton.Color.Light}
  onPress={onConfirm}
  disabled={disabledValue}
/>
        {/* <ButtonLinkPress
             onPress={onConfirm}>
              <OuterIconRow>
                <OuterIconLeft>
                <GoogleLogo source={require('@assets/loading/g-normal.png')} />
                </OuterIconLeft>
                <ButtonText style={{color:"#000",justifyContent:"center",alignSelf:"center",alignItems:"center",alignContent:"center"}}>Sign In</ButtonText>
              </OuterIconRow>
            </ButtonLinkPress> */}
        {/* <TouchableOpacity onPress={onConfirm}>
         <GoogleLogo source={require('@assets/loading/g-normal.png')} />
          <ButtonText>Sign In</ButtonText>
        </TouchableOpacity> */}
        {/* <ToolPress onPress={onConfirm}  disabled={disabledValue}> */}
              
            {/* </ToolPress>  */}
        </ButtonColTwo6>
        </ButtonContainerTwoP>
        </View>
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
    height: 200,
    width: "94%",
    borderRadius: 5,
    padding:"3%",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

 

export default AlertModal;