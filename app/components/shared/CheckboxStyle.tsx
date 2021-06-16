
import styled from 'styled-components/native';
const Checkbox = styled.View`
    background-color: ${props => props.theme.colors.SECONDARY_TEXTCOLOR};
    width:20px;
    height:20px;
    borderRadius:4px;
    
   
`;
export const FormOuterCheckbox = styled.Pressable`

margin-top:10px;
align-items:flex-start;
flex-direction:row;

`
export const CheckboxActive = styled(Checkbox)`
    alignItems:center;
    lineHeight:20px;
    flex-direction:row;
    justify-content:center;
   text-align:center;
    background-color: ${props => props.theme.colors.PRIMARY_TINTCOLOR};
`;


export const CheckboxItemText = styled.Text`
  text-align: left;
  font-size: 16px;
  lineHeight:20px;
  color: #FFF;
  flex:9;
  margin-left:15px;
  font-family: roboto-regular;
  `;

  export const CheckboxContainer = styled.View`
  margin-bottom:20px;
flex-direction:row;
align-items:flex-start;
`;

export const CheckboxItem = styled.View`
margin-right:10px;

`;

export default Checkbox;



