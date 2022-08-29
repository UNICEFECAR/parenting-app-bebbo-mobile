import styled from 'styled-components/native';
const ChildSetupContainer = styled.View`
  width: 100%;
`;

/*Styling for Child Iput Date */
export const FormDateContainer = styled.View`
width:100%;margin-top:10px;
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

export const ChildAddTop = styled.View`
  flex: 1;
  justify-content: space-between;
  flex-direction: row;
`;

export const ChildContentArea = styled.View`
  flex: 1;
  flex-direction: row;
`;

export const LabelTextVac = styled.Text`
  color: ${(props):any => props.theme.colors.SECONDARY_TEXTCOLOR};
  font-size: 16px;
`;
export const LabelText = styled(LabelTextVac)`
  margin-bottom: 7px;
  text-align:left;
`;
export const ChildSection = styled.View`
  flex: 1;
  width: 100%;
  flex-direction: column;
`;
export const ChildListingArea = styled.View`
  width: 100%;
  flex-direction: column;
  justify-content: flex-start;
`;

export const ChildListingBox = styled.View`
  background-color: ${(props):any => props.theme.colors.PRIMARY_TINTCOLOR};
  border-radius:${(props):any => props.theme.borderRadius.BORDERRADIUS};
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
  background-color: ${(props):any => props.theme.colors.SECONDARY_TEXTCOLOR};
  border-radius:${(props):any => props.theme.borderRadius.BORDERRADIUS};
  align-items:center;
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
  color: ${(props):any => props.theme.colors.PRIMARY_TEXTCOLOR};
  font-size: 16px;
  font-weight:bold;
  margin-bottom: 10px;
`;
export const TextAreaBox = styled.View`
background-color: ${(props):any => props.theme.colors.SECONDARY_TEXTCOLOR};
height:75px;
border-radius:${(props):any => props.theme.borderRadius.BORDERRADIUS};
`;
export const TextBox = styled(TextAreaBox)`
height:52px;
padding-top:8px;
padding-bottom:7px;
`;


export const OrView = styled.View`
position:relative;
z-index:11;
justify-content:center;
align-items:center;
margin:15px 0
`;
export const OrHeadingView = styled.View`
padding:5px 0;
min-width:50px;
background-color:${(props):any => props.theme.colors.PRIMARY_COLOR};
`;


export const OrDivider = styled.View`
position:absolute;
width:100%;
height:1px;
background-color:#fff;
top:50%;
left:0;
z-index:0

`;
/*Form Styling*/
export default ChildSetupContainer;
