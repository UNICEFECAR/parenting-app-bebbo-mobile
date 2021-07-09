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

export const DividerArt = styled(Divider)`
border-color:${(props) => props.theme.colors.ARTICLES_COLOR};
margin-top:-2px;
`;
export const DividerContainer = styled.View`
padding:0 15px;
`;
export const Bullets = styled.Text`
background:${props => props.theme.colors.HEALTHCHECKUP_COLOR};
width:7px;
height:7px;
border-radius:100px;
margin-top:6px;
margin-right:7px;
`;

export const BulletsView = styled.View`
flex-direction:row;
`;



