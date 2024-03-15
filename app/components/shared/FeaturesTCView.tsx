import React from 'react';
import styled from 'styled-components/native';
import Icon from './Icon';
import OnboardingHeading from './OnboardingHeading';
import { View } from 'react-native';
import VectorImage from 'react-native-vector-image';

const Title = styled.Text`
  font-size: 14px;
  flex: 1;
  font-weight: bold;
  margin-left: 15px;
  margin-top: 5px;
  color: ${(props: any): any => props.theme.colors.PRIMARY_RE_TEXTCOLOR};
`;

const SubTitle = styled.Text`
  font-size: 14px;
  flex: 1;
  margin-left: 15px;
  color: ${(props: any): any => props.theme.colors.TERMS_TEXTCOLOR};
`;
const MainContainer = styled.View`
  padding-top: 15px;
  padding-bottom: 5px;
  flex-direction: row;
  align-items: center;
`;
const TitleContainer = styled.View`
  flex-direction:column;
  justify-content:center;
`;

const FeatureTCView = (props: any): any => {
  return (
    <MainContainer>
      <VectorImage source={props.iconname} />
      <TitleContainer>
        <Title>{props.title}</Title>
        <SubTitle>{props.subTitle}</SubTitle>
      </TitleContainer>

    </MainContainer>
  );
};
export default FeatureTCView;
