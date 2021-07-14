import styled from 'styled-components/native';
export const ButtonviewNext = styled.Text`
  width: 50px;
  height: 50px;
  margin-top: 10px;
  align-content: center;
  margin-bottom: 10px;
  border-radius:${(props) => props.theme.borderRadius.BORDERRADIUS_CIRCLE};
  text-align: center;
  background-color: ${(props) => props.theme.colors.SECONDARY_COLOR};
`;

export const ButtonviewPrevious = styled(ButtonviewNext)`
  /*background-color: ${(props) => props.theme.colors.SECONDARY_TINTCOLOR};*/
  opacity:0.5;
  justify-content: flex-start;
`;



export const ButtonviewClick = styled.Pressable`
  margin-top: 10px;
  flex-direction: column;
  justify-content: center;
  height: 50px;
  align-content: center;
`;

export const ButtonSection = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  width: 100%;
`;

export const BtnMultiple = styled(ButtonSection)`
  justify-content: space-between;
`;
