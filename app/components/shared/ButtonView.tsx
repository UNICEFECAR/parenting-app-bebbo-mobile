import styled from 'styled-components/native';
export const ButtonviewNext = styled.Text`
  width: 50px;
  height: 50px;
  
  align-content: center;
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
 
  justify-content: center;
  height: 50px;
  width: 50px;
  align-items: center;
`;

export const ButtonSection = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  width: 100%;
`;

export const BtnMultiple = styled(ButtonSection)`
  justify-content: space-between;
`;
