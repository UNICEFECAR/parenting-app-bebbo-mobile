import styled from 'styled-components/native';
const HomeScreenStyle = styled.View`
`;
export default HomeScreenStyle;

export const FeatureImageBox = styled.View`
width:130px;
height:130px;
background-color:#fff;
justify-content:center;
align-items:center;
border-radius:${(props) => props.theme.borderRadius.BORDERRADIUS};
`;

export const FeatureContentBox = styled.View`
margin-left:20px;
justify-content:center;
flex:1;

`;
export const FeatureBox = styled.View`
padding:15px 0;
min-height:170px;

`;

export const ToolBox = styled.View`
padding:10px 0 15px;
flex-direction:row;
margin-left:-3px;
margin-right:-3px;
`;


export const FeatureDivideArea = styled.View`
border-top-width:7px;
border-color:#fff;
`;
export const ToolPress = styled.Pressable`
flex:1;
background-color: ${props => props.theme.colors.SECONDARY_TEXTCOLOR};
margin:3px;
justify-content:flex-start;
align-items:center;
padding:12px 2px 10px;
border-radius:${(props) => props.theme.borderRadius.BORDERRADIUS};
min-height:125px
`;

export const ToolBoxText = styled.Pressable`
margin-top:15px;
`;

export const HomeSurveyBox = styled.Pressable`
padding:17px;
border-radius:${(props) => props.theme.borderRadius.BORDERRADIUS};
background-color: ${props => props.theme.colors.SECONDARY_COLOR};
`;



export const OverlayFaded = styled.Pressable`
position:absolute; bottom:0; width:100%;z-index:99;height:70px;
`;


export const DailyArtTitle = styled.Pressable`

position:absolute; bottom:10px;z-index:999;width:100%;padding:3px 10px;
`;

export const DailyTag = styled.Pressable`
position:absolute; background-color: ${props => props.theme.colors.PRIMARY_COLOR};padding:7px 10px;
border-top-left-radius:4px;
`;
export const DailyTagText = styled.Text`
font-size:11px;
font-family:roboto-regular;
text-transform:capitalize;
color:#fff;

`;
export const DailyAction = styled.View`
flex-direction:row;
justify-content:space-between;
padding:10px;
`;
export const DailyBox = styled.View`
background-color: ${props => props.theme.colors.SECONDARY_TEXTCOLOR};
border-radius:${(props) => props.theme.borderRadius.BORDERRADIUS};
margin:0 7px 15px;
width:285px;
overflow:hidden;

`;

export const BottomBarBg = styled.View`
background-color: ${props => props.theme.colors.SECONDARY_TEXTCOLOR};
padding: 0px 0;
border-top-left-radius:10px;
border-top-right-radius:10px;
border-color:${props => props.theme.colors.PRIMARY_TEXTCOLOR};
border-top-width:3px;

`;

export const OfflineBar = styled.View`
padding:10px;
background-color:#f5f5f5;
border-bottom-width:1px;
border-color:#ccc;

`;

export const BottomBarList = styled.View`

border-bottom-width:1px;
border-color:rgba(0,0,0,0.1);
padding:16px 20px;
min-height:52px;

`;

