import styled from 'styled-components/native';
const HeaderContainerStyle = styled.View``;

export const HeaderRowView = styled.View`
  flex-direction: row;
  flex: 1;
  align-items: center;
`;

export const HeaderIconView = styled.View`
  flex: 1;
  padding: 10px 15px;
  justify-content: center;
`;
export const HeaderTitleView = styled.View`
  flex: 4;
  padding: 10px;
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
  border-radius: 100px;
  width: 40px;
  height: 40px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

// export const ProfileListViewSelected = styled(ProfileListView)`
// background-color: ${props => props.theme.colors.SECONDARY_COLOR};

// `
// export const ProfileIconView = styled.View`
// flex:1
// `

// export const ProfileTextView = styled.View`
// flex:4;
// flex-direction:column;
// justify-content:center;
// padding:0 5px;
// `
// export const ProfileActionView = styled.View`
// flex:2;
// flex-direction:row;
// justify-content:flex-end;
// align-items:center;
// `

export default HeaderContainerStyle;
