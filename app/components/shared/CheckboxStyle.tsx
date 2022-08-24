import styled from 'styled-components/native';
const Checkbox = styled.View`
  width: 20px;
  height: 20px;
  border-radius:${(props):any => props.theme.borderRadius.BORDERRADIUS};
  background-color: ${(props):any => props.theme.colors.SECONDARY_TEXTCOLOR};
`;
export const FormOuterCheckbox = styled.Pressable`
  margin-top: 10px;
  align-items: flex-start;
  flex-direction: row;
`;
export const CheckboxActive = styled(Checkbox)`
  align-items: center;
  line-height: 20px;
  flex-direction: row;
  justify-content: center;
  text-align: center;
  background-color: ${(props):any => props.theme.colors.PRIMARY_TINTCOLOR};
`;

export const CheckboxDevActive = styled(CheckboxActive)`
  background-color: ${(props):any => props.theme.colors.CHILDDEVELOPMENT_COLOR};
`;
export const CheckboxGroActive = styled(CheckboxActive)`
  background-color: ${(props):any => props.theme.colors.CHILDGROWTH_COLOR};
`;
export const CheckboxVacActive = styled(CheckboxActive)`
  background-color: ${(props):any => props.theme.colors.VACCINATION_COLOR};
`;
export const CheckboxChkActive = styled(CheckboxActive)`
  background-color: ${(props):any => props.theme.colors.HEALTHCHECKUP_COLOR};
`;


export const CheckboxItemText = styled.Text`
  text-align: left;
  font-size: 16px;
  line-height: 20px;
  color: #fff;
  flex: 9;
  margin-left: 15px;
  font-family: roboto-regular;
 
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
