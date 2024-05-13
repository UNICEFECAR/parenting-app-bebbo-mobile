import styled from 'styled-components/native';
const HeaderContainerStyle = styled.View``;

export const HeaderRowView = styled.View`
  flex-direction: row;
  flex: 1;
  align-items: center;
  z-index:99999999;
  position:relative;
`;

export const HeaderIconView = styled.View`
  padding: 10px 15px;
  justify-content: center;
`;

export const HeaderIconPress = styled.Pressable`

padding:7px 0px 4px;
width:40px;
height:30px;
margin-left:-8px;
margin-right:-8px;
align-items:center;

`;
export const HeaderBurgerPress = styled(HeaderIconPress)`
width:40px;
margin-left:-8px;
margin-right:-8px;
`;
export const HeaderTitleView = styled.View`
  flex: 4;
  padding: 10px;
  justify-content: center;
`;
export const HeaderTitleExpectedView = styled.View`
  flex: 14;
  padding: 10px;
  justify-content: center;
`;
export const HomeHeaderTitleView = styled.View`
  flex: 4;
  padding-verticle: 10px;
  justify-content: center;
`;
export const HeaderActionView = styled.View`
flex:1;
padding:10px;
align-items:flex-end;
justify-content:flex-start;
`;

export const HeaderActionBox = styled.Pressable`
  background: rgba(255, 255, 255, 0.5);
  border-radius:100px;
  width: 40px;
  height: 40px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  
`;
export default HeaderContainerStyle;
