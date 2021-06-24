import styled from 'styled-components/native';
const ProfileListingStyle = styled.View``;

/*Manage Profile Drowpdown*/

export const ProfileListView = styled.View`
  padding: 10px 15px;
  flex-direction: row;
  align-items: center;
`;

export const ProfileListViewSelected = styled(ProfileListView)`
  background-color: ${(props) => props.theme.colors.SECONDARY_COLOR};
`;
export const ProfileIconView = styled.View`
  flex: 1;
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
  align-items: center;
`;

export const ProfileLinkView = styled.View`
  flex-direction: row;
  margin-top: 10px;
  justify-content: space-between;
`;

/*Manage Profile Drowpdown End */

/*Manage Profile Screen */

export const ProfileListDefault = styled(ProfileListView)`
  padding: 0px 15px;
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
  border-radius: 4px;
`;

/*Manage Profile Screen End*/

export default ProfileListingStyle;
