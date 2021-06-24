import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import Ruler from '@components/Ruler';
import { ButtonPrimary, ButtonText } from '@components/shared/ButtonGlobal';
import Icon from '@components/shared/Icon';
import ModalPopupContainer, {
  PopupClose,
  PopupCloseContainer,
  PopupOverlay
} from '@components/shared/ModalPopupStyle';
import { RootStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading1, Heading2w, Heading4Centerr } from '@styles/typography';
import React, { useContext, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Modal, Pressable, SafeAreaView, View } from 'react-native';
import { ThemeContext } from 'styled-components';
type ChildSetupNavigationProp = StackNavigationProp<RootStackParamList>;

type Props = {
  navigation: ChildSetupNavigationProp;
};

const AddNewChildWeight = ({navigation}: Props) => {
  const {t} = useTranslation();
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.CHILDGROWTH_COLOR;
  const tintColor = themeContext.colors.CHILDGROWTH_TINTCOLOR;
  const [modalVisible, setModalVisible] = useState(false);
  const screenPadding = 10;
  const {height, width} = Dimensions.get('screen');
  const [weight, setweight] = useState<number>(0);
  const [weight1, setweight1] = useState<number>(0.0);
  useLayoutEffect(() => {
    setModalVisible(true);
  }, []);
  return (
    <>
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
        onDismiss={() => {
          setModalVisible(!modalVisible);
        }}>
        <PopupOverlay>
          <ModalPopupContainer>
            <PopupCloseContainer>
              <PopupClose
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}>
                <Icon name="ic_close" size={16} color="#000" />
              </PopupClose>
            </PopupCloseContainer>

            <View>
              <Heading4Centerr>
                {'Move the ruler to indicate weight of your child'}
              </Heading4Centerr>
            </View>
          </ModalPopupContainer>
        </PopupOverlay>
      </Modal>
      <SafeAreaView style={{flex: 1, backgroundColor: headerColor}}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            backgroundColor: headerColor,
            maxHeight: 50,
          }}>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              backgroundColor: headerColor,
              maxHeight: 50,
            }}>
            <View style={{flex: 1, padding: 15}}>
              <Pressable
                onPress={() => {
                  navigation.goBack();
                }}>
                <Icon name={'ic_back'} color="#000" size={15} />
              </Pressable>
            </View>
            <View style={{flex: 8, padding: 7}}>
              <Heading2w style={{color: '#000'}}>
                {t('growthScreen.addWeight')}
              </Heading2w>
            </View>
          </View>
        </View>
        <View style={{padding: screenPadding, backgroundColor: tintColor}}>
          <Heading1 style={{textAlign: 'center'}}>
            {(weight + 0.01 * weight1).toFixed(2)} {t('growthScreen.kgText')}
          </Heading1>
          <Ruler
            style={{elevation: 3}}
            width={width - screenPadding - screenPadding}
            height={100}
            vertical={false}
            onChangeValue={(value) => setweight(value)}
            minimum={0}
            maximum={20}
            segmentWidth={2}
            segmentSpacing={20}
            indicatorColor="#AB8AD5"
            indicatorWidth={100}
            indicatorHeight={100}
            indicatorBottom={0}
            step={10}
            stepPreFix={1}
            stepColor="#333333"
            stepHeight={40}
            normalColor="#999999"
            normalHeight={20}
            backgroundColor={'#FFF'}
          />
          <View style={{marginBottom: 20}}></View>
          <Ruler
            style={{elevation: 3}}
            width={width - screenPadding - screenPadding}
            height={100}
            vertical={false}
            onChangeValue={(value) => setweight1(value)}
            minimum={0}
            maximum={100}
            segmentWidth={2}
            segmentSpacing={20}
            indicatorColor="#AB8AD5"
            indicatorWidth={100}
            indicatorHeight={100}
            indicatorBottom={0}
            step={10}
            stepPreFix={0.01}
            stepColor="#333333"
            stepHeight={40}
            normalColor="#999999"
            normalHeight={20}
            backgroundColor={'#D5C5EA'}
          />
        </View>

        <View style={{width: '100%', marginTop: 30}}>
          <ButtonPrimary
            onPress={() => {
              navigation.goBack();
            }}>
            <ButtonText>{t('growthScreen.saveMeasuresDetails')}</ButtonText>
          </ButtonPrimary>
        </View>
      </SafeAreaView>
    </>
  );
};

export default AddNewChildWeight;
