
import styled from 'styled-components/native';
const Checkbox = styled.Text`
    background-color: ${props => props.theme.colors.SECONDARY_TEXTCOLOR};
    width:20px;
    height:20px;
    borderRadius:100px;
   
`;

export const CheckboxActive = styled(Checkbox)`
    alignItems:center;
    lineHeight:20px;
    flex-direction:row;
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
flexDirection: row;
alignItems:center;
padding: 15px 0;
alignItems: center;
  border-color: rgba(255,255,255,.3);
  border-bottom-width: 0.5px;
  border-radius: 3px;

`;

export default Checkbox;



