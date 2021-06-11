import styled from 'styled-components/native';
const Radio = styled.Text`
  background-color: ${(props) => props.theme.colors.SECONDARY_TEXTCOLOR};
  width: 20px;
  height: 20px;
  border-radius: 100px;
`;

export const RadioActive = styled(Radio)`
  align-items: center;
  line-height: 20px;
  flex-direction: row;
  text-align: center;
  background-color: ${(props) => props.theme.colors.PRIMARY_TINTCOLOR};
`;

export const RadioItemText = styled.Text`
  text-align: left;
  font-size: 16px;
  line-height: 20px;
  color: #fff;
  flex: 9;
  margin-left: 15px;
  font-family: ${(props: any) =>
    props.isActive
      ? props.theme.fonts.ROBOTO_BOLD
      : props.theme.fonts.ROBOTO_REGULAR};
`;

export const RadioItem = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 15px 0;
  border-color: rgba(255, 255, 255, 0.3);
  border-bottom-width: 0.5px;
  border-radius: 3px;
`;

export default Radio;
