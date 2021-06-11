
import styled from 'styled-components/native';
const ChildSetupContainer = styled.View`
flex:1;
width:100%;
`;




export const ChildCenterView = styled.View`
flex: 1;
justify-content:center;
flex-direction:row;
`

export const ChildContentArea = styled.View`
flex: 1;
flex-direction:row;
`
export const LabelText = styled.Text`

color:${props => props.theme.colors.SECONDARY_TEXTCOLOR};
font-size:16px;
margin-bottom:7px;
`
export const ChildSection = styled.View`

flex:1;
width:100%;
flex-direction:row;
`

export default ChildSetupContainer;


