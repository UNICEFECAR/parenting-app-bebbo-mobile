import styled from 'styled-components/native';
const Radio = styled.View`
  background-color: ${(props:any):any => props.theme?.colors?.SECONDARY_TEXTCOLOR};
  width: 20px;
  height: 20px;
  border-radius:100px;
  border-width:1px;
  border-color:#2D2926;
`;

export const RadioActive = styled(Radio)`
  align-items: center;
  line-height: 20px;
  flex-direction: row;
  text-align: center;
  border-width:0px;
  justify-content:center;
  background-color: ${(props:any):any => props.theme?.colors?.SECONDARY_RE_COLOR};
`;

export const RadioItemText = styled.Text`
  text-align: left;
  font-size: 16px;
  line-height: 20px;
  color: #2D2926;
  flex: 9;
  margin-left: 15px;
  fontFamily: ${(props: any):any =>
    props.isActive
      ? props.theme.fonts.ROBOTO_BOLD
      : props.theme.fonts.ROBOTO_REGULAR};
`;


export const RadioItem = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 15px 0;
`;

export const RadioCountryItem = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 15px 0;
  border-color: rgba(200, 191, 191, 0.7);
  border-bottom-width: 1px;
  border-radius:4px;
`;

export const RadioBoxContainer = styled.View`
 margin:0 -10px;

`;
export const RadioOuter = styled.View`
 
 flex-direction:row;
 flex:1;
 justify-content:center;
 align-items:center;
 padding:0 10px;

 
`;
export const RadioInnerBox = styled.Pressable`
  flex:1;
  flex-direction:row;
  background:${(props:any):any => props.theme?.colors?.SECONDARY_TEXTCOLOR};
  align-items:center;
  justify-content:flex-start;
  border-radius:4px;
  border-color:#2D2926;
  padding:5px 10px;
  height:52px;
  
`;
export const RadioLabelText = styled.Text`
  color: ${(props:any):any => props.theme?.colors?.SECONDARY_TEXTCOLOR};
  font-size: 16px;
 
`

export default Radio;
