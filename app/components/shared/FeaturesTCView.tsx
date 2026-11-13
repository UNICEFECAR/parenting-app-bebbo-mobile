import styled from 'styled-components/native';
import VectorImage from 'react-native-vector-image';

const Title = styled.Text`
  text-align: start;
  font-size: 14px;
  font-weight: bold;
  margin-top: 5px;
  color: ${(props: any): any => props.theme.colors.PRIMARY_RE_TEXTCOLOR};
`;

const SubTitle = styled.Text`
  text-align: start;
  font-size: 14px;
  margin-top: 5px;
  line-height: 16px;
  color: ${(props: any): any => props.theme.colors.TERMS_TEXTCOLOR};
`;
const MainContainer = styled.View`
  padding-top: 15px;
  padding-bottom: 5px;
  width: 100%;
  flex-direction: row;
  align-items: center;
`;
const TitleContainer = styled.View`
  flex-direction:column;
  flex: 1;
  min-width: 0;
  margin-start: 15px;
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
