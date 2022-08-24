import React from 'react';
import styled from 'styled-components/native';
import Icon from './Icon';
import OnboardingHeading from './OnboardingHeading';

const Title = styled.Text`
  font-size: 20px;
  flex: 1;
  font-weight: bold;
  margin-left: 15px;
  color: ${(props):any => props.theme.colors.SECONDARY_TEXTCOLOR};
`;

const OnboardingStyle = (props: any):any => {
  return (
    <OnboardingHeading>
      <Icon name={props.iconname} size={30} color="#FFF" />
      <Title>{props.title}</Title>
    </OnboardingHeading>
  );
};
export default OnboardingStyle;
