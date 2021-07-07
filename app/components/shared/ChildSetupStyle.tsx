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
  /*margin-top: 10px;*/
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
export const LabelText = styled.Text`
  color: ${(props) => props.theme.colors.SECONDARY_TEXTCOLOR};
  font-size: 16px;
  margin-bottom: 7px;
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
  background-color: ${(props) => props.theme.colors.PRIMARY_TINTCOLOR};
  border-radius: 4px;
  padding: 10px;
  flex-direction: row;
  margin-bottom: 15px;
`;
export const ChildListTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
`;

export const ChildColArea1 = styled.View`
  flex: 1;
`;
export const ChildColArea2 = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;
export const TitleLinkSm = styled.Text`
  font-size: 12px;
  font-weight: bold;
  padding: 0 5px;
`;

/*Form Styling*/
export const FormContainer = styled.View`
  margin-top:25px;
  
`;
export const FormContainerFlex = styled(FormContainer)`
  flex:1
`;

export const FormInputBox = styled.View`
  flex-direction: row;
  background-color: ${(props) => props.theme.colors.SECONDARY_TEXTCOLOR};
  border-radius: 4px;
  align-items:center;
  justify-content:space-between;
  height:52px;
  padding:12px;
`;
export const FormDateText = styled.View`
  /*flex: 4;*/
  /*justify-content: flex-start;
  flex-direction: row;*/
  
`;

export const FormDateAction = styled.View`
 /* flex: 1;
  justify-content: center;
  flex-direction: row;*/
  
 
`;

export const FormInputGroup = styled.Pressable`
  width: 100%;
`;

export const FormInputText = styled(LabelText)`
  color: ${(props) => props.theme.colors.PRIMARY_TEXTCOLOR};
  font-size: 16px;
  font-weight:bold;
  margin-bottom: 10px;
`;
export const TextAreaBox = styled.View`
  background-color: ${(props) => props.theme.colors.SECONDARY_TEXTCOLOR};
  padding: 0 15px;
height:75px;
border-radius:4px;
`;


/*Form Styling*/
export default ChildSetupContainer;
