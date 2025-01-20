import styled from 'styled-components/native';
const ChildSetupContainer = styled.View`
  width: 100%;
`;

/*Styling for Child Iput Date */
export const FormDateContainer = styled.View`
width:100%;
margin-top:10px;
`
export const CustomScrollView = styled.ScrollView`
flex:1;
`

/*Styling for Child Iput Date */

export const ChildRelationList = styled.Pressable`
  width: 100%;
  padding: 16px 25px 8px;
  border-bottom-width: 1px;
  border-color: rgba(0, 0, 0, 0.2);
`;

export const FormOuterCheckbox = styled.Pressable`
  align-items: flex-start;
  flex-direction: row;
`;

export const ChildCenterView = styled.View`
  flex: 1;
  justify-content: center;
  flex-direction: column;
`;
export const ChildTabView = styled.View`
  flex: 1;
  justify-content: center;
  margin-top:30px;
  flex-direction: row;
`;

export const ChildAddTop = styled.View`
  flex: 1;
  justify-content: space-between;
  flex-direction: row;
`;

export const ChildContentArea = styled.View`
  flex-direction: row;
`;

export const LabelTextVac = styled.Text`
  color: ${(props:any):any => props.theme.colors.PRIMARY_RE_TEXTCOLOR};
  font-size: 14px;
`;

export const LabelTextTerms = styled.Text`
  color: ${(props:any):any => props.theme.colors.PRIMARY_RE_TEXTCOLOR};
  font-size: 14px;
  text-align:left;
`;

export const LabelDatePlaceHolderText = styled.Text`
  color: rgba(119, 119, 121, 0.45);
  font-size: 14px;
  fontFamily: roboto-regular;
`;

export const LabelText = styled(LabelTextVac)`
  text-align:left;
`;
export const LabelWithInfoText = styled(LabelTextVac)`
  text-align:left;
  flex:2;
`;
export const LabelChildText = styled(LabelTextVac)`
  text-align:left;
  margin-top: 3px;
`;
export const LinkText = styled.Text`
  font-size: 16px;
  text-align: center;
  margin-top: 10px; /* Adjusted margin-top */
  color: blue; /* Change the color as needed */
`;

export const LinkContainer = styled.View`
  flex-direction: row;
`;
export const LabelText1 = styled(LabelTextVac)`
text-align:left;
`;
export const ChildSection = styled.View`
  flex: 1;
  width: 100%;
  flex-direction: column;
`;
export const ChildListingArea = styled.View`
  width: 100%;
  margin-top:20px;
  flex-direction: column;
  justify-content: flex-start;
`;

export const ChildListingBox = styled.View`
  background-color: ${(props:any):any => props.theme.colors.PRIMARY_TINTCOLOR};
  border-radius:4px;
  padding: 10px;
  flex-direction: row;
  margin-bottom: 15px;
`;
export const ChildListTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  text-align:left;
`;

export const ChildColArea1 = styled.View`
  flex: 1;
  margin-start:10px;
`;
export const ChildColArea2 = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-left:5px;
`;
export const TitleLinkSm = styled.Text`
  font-size: 12px;
  font-weight: bold;
 text-align:center;
  flex-shrink:1;
  
`;
export const ChildListAction = styled.View`
  flex:1;
  justify-content:center;
  align-items:center;
  max-width:45px;
  padding: 0 2px;
  flex-direction:row;
`;

/*Form Styling*/
export const FormContainer = styled.View`
  margin-top:25px;
  
`;
export const FormContainer1 = styled(FormContainer)`
  margin-top:20px;
  
`;
export const FormContainerFlex = styled(FormContainer)`
  flex:1
`;
export const FormContainerFlex1 = styled(FormContainerFlex)`
margin-top:0;
`;
export const FormInputBox = styled.View`
  flex-direction: row;
  background-color: ${(props:any):any => props.theme.colors.SECONDARY_TEXTCOLOR};
  border-radius:4px;
  align-items:center;
  margin-top:10;
  border-color:'#CCCCCC';
  border-width:1px;
  justify-content:space-between;
  height:52px;
  padding:5px 12px;

`;
export const FormInputBoxWithoutLine = styled.View`
  flex-direction: row;
  background-color: ${(props:any):any => props.theme.colors.SECONDARY_TEXTCOLOR};
  border-radius:4px;
  align-items:center;
  margin-top:10;
  justify-content:space-between;
  height:52px;
  padding:5px 12px;

`;
export const FormDateText = styled.View`
   
`;
export const FormDateText1 = styled.View`
  flex:1
   
`;
export const FormDateAction = styled.View`
  margin-left:5px;
`;
export const FormInputGroup = styled.Pressable`
  width: 100%;
  padding:5px 0px;
`;
export const FormInputText = styled(LabelText)`
  color: ${(props:any):any => props.theme.colors.PRIMARY_TEXTCOLOR};
  font-size: 16px;
  font-weight:bold;
  margin-bottom: 10px;
`;
export const TextAreaBox = styled.View`
background-color: ${(props:any):any => props.theme.colors.SECONDARY_TEXTCOLOR};
height:75px;
border-radius:4px;
`;
export const TextBox = styled(TextAreaBox)`
height:52px;
padding-top:8px;
padding-bottom:7px;
`;


export const OrView = styled.View`
justify-content:center;
align-items:center;
margin:15px 0
`;

export const OrHeadingView = styled.View`
flex:2;
flex-direction: row;
margin-horizontal:20px;
margin-top:30px;
margin-end:20px;
`;


export const ParentSetUpDivider = styled.View`
flex:1;
border-color:#1CABE2;
background-color:#1CABE2;
border-radius:4px;
height:3px;
`;

export const ChildSetupDivider = styled.View`
flex:1;
border-color:#777779;
background-color:#777779;
border-radius:4px;
height:3px;
`;
/*Form Styling*/
export default ChildSetupContainer;
