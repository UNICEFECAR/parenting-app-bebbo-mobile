import styled from 'styled-components/native';
const Container = styled.View`
  width: 100%;
`;
export default Container;



export const SafeAreaContainer = styled.SafeAreaView`
background-color:${(props) => props.theme.colors.SECONDARY_TEXTCOLOR};
flex:1
`;

export const MainContainer = styled.View`
  width: 100%;
  padding:10px 15px;
`;
export const AreaContainer = styled.View`
  width: 100%;
  padding:15px;
`;

export const VacItemContainer = styled.View`
  width: 100%;
  padding:15px 15px 8px;
  border-bottom-width:1px;
  border-color:rgba(0,0,0,0.2)
  
`;

export const BannerContainer = styled.View`
border-radius:${(props) => props.theme.borderRadius.BORDERRADIUS};
  padding:20px 15px;
  background-color:${(props) => props.theme.colors.SECONDARY_TEXTCOLOR};
`;

export const BannerContainer1 = styled(BannerContainer)`
  padding:15px 15px;
  margin-bottom:20px;
`;


export const BgContainer = styled.View`
  background-color:${(props) => props.theme.colors.SECONDARY_TEXTCOLOR};
  border-radius:${(props) => props.theme.borderRadius.BORDERRADIUS};

`;