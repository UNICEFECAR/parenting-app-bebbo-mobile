import styled from 'styled-components/native';
const ProfileListingStyle = styled.View``;

/*Manage Profile Drowpdown*/

export const ProfileListView = styled.View`
  padding: 11px 8px;
  flex-direction: row;
  align-items: center;
  
`;



export const ProfileListViewSelected = styled(ProfileListView)`
  background-color: ${(props:any):any => props.theme?.colors?.TERTIARY_BG_COLOR};
  margin-bottom:3px;
  align-items:flex-start;
`;
export const ProfileListViewSelected1 = styled(ProfileListViewSelected)`
border-radius:4px;
margin-bottom:15px;
`;
export const ProfileIconView = styled.View`
 min-width:48px;
 text-align:center;
 align-items:center;
 margin-left:-5px;
`;

export const ProfileTextView = styled.View`
  flex: 4;
  flex-direction: column;
  justify-content: center;
  padding: 0 5px;
`;
export const ProfileActionView = styled.View`
  flex: 2;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-start;
  
`;

export const ProfileLinkView = styled.View`
  flex-direction: row;
  margin-top: 10px;

`;

/*Manage Profile Drowpdown End */

/*Manage Profile Screen */

export const ProfileListDefault = styled(ProfileListView)`
  padding: 0px 8px;
  
`;
export const ProfileSectionView = styled.View`
  flex-direction: row;
  align-items: center;
`;
export const ProfileListInner = styled.View`
  flex-direction: row;
  border-color: rgba(0, 0, 0, 0.1);
  border-bottom-width: 1px;
  padding: 12px 0 14px;
`;
export const ProfileListActiveChild = styled(ProfileListView)`
  align-items: flex-start;
  border-radius:4px;
`;

export const ProfileLinkRow = styled.View`
width:100%;
  flex-direction:column;
  margin:0;
  padding:5px 10px;
 margin-bottom:15px;
 border-radius:4px;
 margin-top:-4px;
 border-color: rgba(0, 0, 0, 0.1);
 border-top-width: 1px;
 
`;

export const ProfileLinkCol = styled.View`
 
  align-items:center;
  justify-content:center;  
  padding: 2px 20px;
 
`;
export const ProfileContentView = styled.View`
 width:100%;
 align-items:center;
 flex-direction:row;
 
`;

export const ParentRowView = styled.View`
 flex-direction:column;
 flex:1;
 margin:6px 0 10px;
`;
export const ParentSection = styled.View`
flex-direction:row;
padding:5px 7px;
`

export const ParentLabel = styled.View`
 flex:1;
 align-items:flex-start;
`;
export const ParentData = styled.View`
flex:1;
align-items:flex-start;
`;
export const ParentListView = styled.View`
padding:10px 11px 3px;
align-items:center;
border-radius:4px;
`

export const ChildListScrollView = styled.View`
height:350px;margin-top:15px;
border-radius:4px;
`

export const ProfileEditView = styled.Pressable`
background-color:#fff;
border-radius:100px;
margin:10px;
align-items:center;
justify-content:center;
width:40px;
height:40px;

`

/*Manage Profile Screen End*/

export default ProfileListingStyle;
