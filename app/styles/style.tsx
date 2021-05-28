import styled from 'styled-components/native';
export const Container = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  background-color: #fff;
`;
// ${props => props.theme.PRIMARY_BACKGROUND_COLOR}
export const ButtonText = styled.Text`
  text-align: center;
  color: #000;
`;
export const SelectionView = styled.View`
  border-width: 1px;
  border-radius: 2px;
  border-color: #ddd;
  border-bottom-width: 0;
  margin-left: 5px;
  margin-right: 5px;
  flex: 1;
`;
export const RadioItemText = styled.Text`
  text-align: left;
  font-weight: ${(props: any) => (props.isActive ? 'bold' : 'normal')};
  font-size: 15px;
`;
export const RadioItem = styled.View`
  padding: 17px;
  /* margin-left: 5px;
  margin-right: 5px; */
  border-color: #cacaca;
  border-width: 0.5px;
  border-radius: 3px;
  background: ${(props: any) => (props.isActive ? '#bbb' : '#FFF')};
`;
// color: ${props => props.theme.PRIMARY_FOREGROUND_COLOR};
//   font-family: ${props => props.theme.PRIMARY_FONT_FAMILY};
//   font-size: ${props => props.theme.FONT_SIZE_LARGE};

export const Header = styled.View`
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 10px;
  padding-right: 10px;
`;
export const MiniHeader = styled.View`
  padding-top: 40px;
  padding-bottom: 30px;
  padding-left: 100px;
  padding-right: 100px;
  display:flex;
  flex-direction:column;
  alignItems:center;
`;
/* background-color: ${props => props.theme.PRIMARY_COLOR}; */
export const HeaderText = styled.Text`
  font-size: 24px;
  color: black;
`;
export const Header2Text = styled.Text`
  font-size: 18px;
  color: black;
  text-align: center;
  font-weight: ${'bold'};
  marginBottom:10px;
`;
export const Header3Text = styled.Text`
  font-size: 14px;
  color: black;
  text-align: center;
  font-weight: ${'normal'};
`;
// color: ${props => props.theme.PRIMARY_FOREGROUND_COLOR};
//   font-family: ${props => props.theme.PRIMARY_FONT_FAMILY};
// const Body = styled.View`
//   flex-direction: column;
//   justify-content: space-between;
//   align-items: stretch;
//   background-color: ${props => props.theme.PRIMARY_BACKGROUND_COLOR};
//   padding-top: 30;
//   padding-bottom: 30;
//   padding-left: 30;
//   padding-right: 30;
// `;

export const LocalizationContainer = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  background-color: #eee;
  align-items: stretch;
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 20px;
  margin-bottom: 60px;
  border-radius:5px;
`;

// const Icon = styled.Image`
//   height: 60;
//   width: 60;
// `;
// const Title = styled.Text`
//   color: ${props => props.theme.PRIMARY_TEXT_COLOR};
//   font-size: ${props => props.theme.FONT_SIZE_MASSIVE};
//   font-family: ${props => props.theme.PRIMARY_FONT_FAMILY};
// `;

// const Description = styled.Text`
//   color: ${props => props.theme.PRIMARY_TEXT_COLOR};
//   font-size: ${props => props.theme.FONT_SIZE_MEDIUM};
//   font-family: ${props => props.theme.PRIMARY_FONT_FAMILY};
//   padding-top: 20;
// `;

// const TextInputContainer = styled.View`
//   border-bottom-width: 1;
//   border-bottom-color: #e0e0e0;
// `;

// const TextInput = styled.TextInput`
//   color: ${props => props.theme.PRIMARY_TEXT_COLOR};
//   font-size: ${props => props.theme.FONT_SIZE_MEDIUM};
//   font-family: ${props => props.theme.PRIMARY_FONT_FAMILY};
//   padding-top: 20;
// `;

// const Footer = styled.View`
//   padding-top: 20;
//   padding-bottom: 20;
//   padding-left: 20;
//   padding-right: 20;
//   flex-direction: column;
//   justify-content: center;
//   align-items: stretch;
//   background-color: ${props => props.theme.PRIMARY_BACKGROUND_COLOR};
// `;
// const PBButton = styled.TouchableOpacity`
//   padding-top: 10;
//   padding-bottom: 10;
//   padding-left: 10;
//   padding-right: 10;
//   flex-direction: column;
//   justify-content: center;
//   align-items: stretch;
//   elevation: 1;
//   border-radius: 2;
//   background-color:#8f8686;
// `;
