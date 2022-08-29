import styled from 'styled-components/native';
const Radio = styled.View`
  background-color: ${(props):any => props.theme.colors.SECONDARY_TEXTCOLOR};
  width: 20px;
  height: 20px;
  border-radius:${(props):any => props.theme.borderRadius.BORDERRADIUS_CIRCLE};
`;

export const RadioActive = styled(Radio)`
  align-items: center;
  line-height: 20px;
  flex-direction: row;
  text-align: center;
  justify-content:center;
  background-color: ${(props):any => props.theme.colors.PRIMARY_TINTCOLOR};
`;

export const RadioItemText = styled.Text`
  text-align: left;
  font-size: 16px;
  line-height: 20px;
  color: #fff;
  flex: 9;
  margin-left: 15px;
  font-family: ${(props: any):any =>
    props.isActive
      ? props.theme.fonts.ROBOTO_BOLD
      : props.theme.fonts.ROBOTO_REGULAR};
`;

export const RadioItem = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 15px 0;
  border-color: rgba(255, 255, 255, 0.3);
  border-bottom-width: 0.5px;
  border-radius:${(props):any => props.theme.borderRadius.BORDERRADIUS};
`;

export const RadioBoxContainer = styled.View`
 margin:0 -10px;

`;
export const RadioOuter = styled.View`
 
 flex-direction:row;
 flex:1;
 justify-content:center;
 padding:0 10px
 
`;
export const RadioInnerBox = styled.Pressable`
  flex:1;
  flex-direction:row;
  background:${(props):any => props.theme.colors.SECONDARY_TEXTCOLOR};
  align-items:center;
  justify-content:flex-start;
  border-radius:${(props):any => props.theme.borderRadius.BORDERRADIUS};
  padding:5px 10px;
  height:52px;
  
`;
export const RadioLabelText = styled.Text`
  color: ${(props):any => props.theme.colors.SECONDARY_TEXTCOLOR};
  font-size: 16px;
 
`

export default Radio;
