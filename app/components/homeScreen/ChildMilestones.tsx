import { BgDevelopmentTint } from '@components/shared/BackgroundColors';
import {
  ButtonContainer,
  ButtonDevelopment,
  ButtonPrimary,
  ButtonText
} from '@components/shared/ButtonGlobal';
import { MainContainer } from '@components/shared/Container';
import { FlexDirRow } from '@components/shared/FlexBoxStyle';
import { FeatureContentBox, FeatureBox, FeatureImageBox,FeatureDivideArea} from '@components/shared/HomeScreenStyle';
import { useNavigation } from '@react-navigation/native';
import { Heading2, ShiftFromBottom15 } from '@styles/typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import VectorImage from 'react-native-vector-image';
import styled from 'styled-components/native';


// const MilestoneCircle = () => (

//   <View style={{
//     width: circleWidth,
//     height: circleWidth,
//     // borderRadius: circleWidth / 2,
//     backgroundColor: '#FFF',
//     justifyContent: 'center',
//     alignItems: 'center'
//   }}>
//     <VectorImage source={require('@assets/svg/ic_development_color.svg')} />
//   </View>
// );

const DATA = [
  {
    id: '1',
    imagePath: require('@assets/trash/card1.jpeg'),
    title: 'Gripping your filgers',
  },
  {
    id: '2',
    imagePath: require('@assets/trash/card2.jpeg'),
    title: 'Molding your hands',
  },
  {
    id: '3',
    imagePath: require('@assets/trash/card3.jpeg'),
    title: 'Picking stuff around',
  },
  {
    id: '4',
    imagePath: require('@assets/trash/card4.jpeg'),
    title: 'Gripping your filgers',
  },
  {
    id: '5',
    imagePath: require('@assets/trash/card5.jpeg'),
    title: 'Molding your hands',
  },
  {
    id: '6',
    imagePath: require('@assets/trash/card6.jpeg'),
    title: 'Picking stuff around',
  },
];
const ChildMilestones = () => {
  // const renderDailyReadItem = (item: typeof DATA[0], index: number) => {
  //   if (index === 0) {
  //     return (<MilestoneCircle key={index} />)
  //   } else {
  //     return (
  //       <View style={styles.item} key={index}>
  //         <Image style={styles.cardImage}
  //           source={item.imagePath} resizeMode={'cover'} />
  //         <Text style={styles.title}>{item.title}</Text>
  //       </View>
  //     )
  //   }
  // }
  const navigation = useNavigation();
  const {t} = useTranslation();
  return (
    <>
      <BgDevelopmentTint>
      <FeatureDivideArea>
        <MainContainer>
          <FeatureBox>
         <FlexDirRow>
          <FeatureImageBox>
            <VectorImage
              source={require('@assets/svg/ic_development_color.svg')}
            />
          </FeatureImageBox>
          <FeatureContentBox>
            <ShiftFromBottom15>
            <Heading2>{t('homeScreencdHeader')}</Heading2>
            </ShiftFromBottom15>
              <ButtonDevelopment
                onPress={() => navigation.navigate('ChildDevelopment')}>
                <ButtonText>{t('homeScreencdButton')}</ButtonText>
              </ButtonDevelopment>
          </FeatureContentBox>
          </FlexDirRow>
          </FeatureBox>
        </MainContainer>
        </FeatureDivideArea>
      </BgDevelopmentTint>
    </>
  );
};

export default ChildMilestones;
