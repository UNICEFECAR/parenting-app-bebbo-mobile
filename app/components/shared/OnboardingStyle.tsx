import React from 'react';
import styled from 'styled-components/native';
import Icon from './Icon';
import OnboardingHeading from './OnboardingHeading';

const Title = styled.Text`
  font-size: 20px;
  flex: 1;
  font-weight: bold;
  margin-left: 15px;
  color: ${(props:any):any => props.theme.colors.PRIMARY_RE_TEXTCOLOR};
`;

const OnboardingStyle = (props: any):any => {
  return (
    <OnboardingHeading>
      <Icon name={props.iconname} size={12} color="#2D2926" />
      <Title>{props.title}</Title>
    </OnboardingHeading>
  );
};
export default OnboardingStyle;
