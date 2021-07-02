import styled from 'styled-components/native';


const Divider = styled.View`
border-bottom-width:1px;
border-color:${(props) => props.theme.colors.PRIMARY_TEXTCOLOR};
padding:1px;
margin:5px 0
`;
export default Divider;


export const DividerDev = styled(Divider)`
border-color:${(props) => props.theme.colors.CHILDDEVELOPMENT_COLOR};
`;
export const DividerContainer = styled.View`
padding:0 15px;
`;



