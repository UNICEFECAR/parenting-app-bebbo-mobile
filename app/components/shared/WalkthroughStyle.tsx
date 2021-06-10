
import styled from 'styled-components/native';
const WalkthroughContainer = styled.View`
flex:1;
width:100%;
`;


export const Slide = styled.View`
flex: 1;
resize-mode: cover;
justify-content: center;
align-items: center;
width: 100%;
height: 100%;
padding:0 25px;
`

export const WalkthroughImagebox = styled.Text`
background : #fff;
padding:20px;
border-radius:4px;
`

export const WalkthroughTitle = styled.Text`
font-size:24px;
margin-top:50px;
font-weight:bold;
text-align:center;
margin-bottom:40px
`
export const WalkthroughSubtext = styled.Text`
font-size:20px;
text-align:center;
padding:0 25px;
font-family: roboto-regular;
`

export default WalkthroughContainer;


