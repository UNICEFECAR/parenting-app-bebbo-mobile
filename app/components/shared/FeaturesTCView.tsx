import styled from 'styled-components/native';
import VectorImage from 'react-native-vector-image';

const Title = styled.Text`
  font-size: 14px;
  font-weight: bold;
  margin-left: 15px;
  margin-top: 5px;
  color: ${(props: any): any => props.theme.colors.PRIMARY_RE_TEXTCOLOR};
`;

const SubTitle = styled.Text`
  font-size: 14px;
  margin-left: 15px;
  margin-right: 8px;
  margin-top: 5px;
  line-height: 16px;
  color: ${(props: any): any => props.theme.colors.TERMS_TEXTCOLOR};
`;
const MainContainer = styled.View`
  padding-top: 15px;
  padding-bottom: 5px;
  padding-right: 50px;
  flex-direction: row;
  align-items: center;
`;
const TitleContainer = styled.View`
  flex-direction:column;
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
