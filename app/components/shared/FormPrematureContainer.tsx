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
export const FormInfoPressPremature = styled.Pressable`
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
`;

export const FormInfoButtonPress = styled.Pressable`
  padding: 0px 2px 10px;
`;

export const FormDobInfoPress = styled.Pressable`
padding: 10px 10px;
`;
export default FormPrematureContainer;
