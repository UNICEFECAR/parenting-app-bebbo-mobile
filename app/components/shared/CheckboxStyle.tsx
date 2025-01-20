import styled from 'styled-components/native';
const Checkbox = styled.View`
  width: 20px;
  height: 20px;
  border-radius:4px;
  background-color: ${(props:any):any => props.theme.colors.SECONDARY_TEXTCOLOR};
  border-width:1px;
  border-color:#2D2926;
`;
export const FormOuterCheckbox = styled.Pressable`
  margin-top: 10px;
  margin-bottom: 30px;
  align-items: flex-start;
  flex-direction: row;
`;
export const FormOuterTermsCheckbox = styled.Pressable`
  margin-bottom: 30px;
  align-items: flex-start;
  flex-direction: row;
`;
export const CheckboxActive = styled(Checkbox)`
  align-items: center;
  line-height: 20px;
  flex-direction: row;
  justify-content: center;
  border-width:0px;
  text-align: center;
  background-color: ${(props:any):any => props.theme.colors.SECONDARY_RE_COLOR};
`;

export const CheckboxDevActive = styled(CheckboxActive)`
  background-color: ${(props:any):any => props.theme.colors.CHILDDEVELOPMENT_COLOR};
`;
export const CheckboxGroActive = styled(CheckboxActive)`
  background-color: ${(props:any):any => props.theme.colors.CHILDGROWTH_COLOR};
`;
export const CheckboxVacActive = styled(CheckboxActive)`
  background-color: ${(props:any):any => props.theme.colors.VACCINATION_COLOR};
`;
export const CheckboxChkActive = styled(CheckboxActive)`
  background-color: ${(props:any):any => props.theme.colors.HEALTHCHECKUP_COLOR};
`;


export const CheckboxItemText = styled.Text`
  text-align: left;
  font-size: 16px;
  line-height: 20px;
  color: #777779;
  flex: 9;
  margin-left: 15px;
  fontFamily: roboto-regular;
 
`;

export const CheckboxContainer = styled.View`
  margin-bottom: 20px;
  flex-direction: row;
  align-items: flex-start;
`;

export const CheckboxItem = styled.View`
  margin-right: 10px;
  margin-top:2px;
  
`;

export default Checkbox;
