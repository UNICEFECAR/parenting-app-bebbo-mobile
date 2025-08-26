import styled from 'styled-components/native';
const FormPrematureContainer = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
`;

export const FormInfoLabel = styled.View`
  flex-direction: row;
  margin-left: 0px;
  margin-top: 2px;

`;
export const FormInfoPress = styled.Pressable`
  padding: 10px 10px;
`;
export const FormInfoPressPremature = styled.Text`
  margin-left: 4px;
`;

export const FormInfoButtonPress = styled.Pressable`
  padding: 0px 2px 10px;
`;

export const FormDobInfoPress = styled.Pressable`
padding: 10px 10px;
`;
export default FormPrematureContainer;
