import styled from 'styled-components/native';
const WalkthroughContainer = styled.View`
  flex: 1;
  width: 100%;
`;

export const Slide = styled.View`
  flex: 1;
  resize-mode: cover;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0 15px;
`;

export const WalkthroughImagebox = styled.View`
  background: #fff;
  padding: 25px;
  border-radius: 20px;
  margin-bottom: 20px;
  width: 200px;
  flex-direction: row;
  align-items: center;
  justify-content:center;
  text-align: center;
`;

export const WalkthroughTitle = styled.Text`
  font-size: 24px;
  margin-top: 10px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 25px;
`;
export const WalkthroughSubtext = styled.Text`
  font-size: 20px;
  text-align: center;
  padding: 0 20px;
  font-family: roboto-regular
`;

export const ButtonTertiary1 = styled.View`
  padding: 15px 30px;
  border-radius:${(props):any => props.theme.borderRadius.BORDERRADIUS};
  font-size: 16px;
  color: ${(props):any => props.theme.colors.PRIMARY_TEXTCOLOR};
  background-color: ${(props):any => props.theme.colors.SECONDARY_TEXTCOLOR};
  flex: 1;
  min-width: 140px;
`;

export const ButtonTertiary2 = styled(ButtonTertiary1)`
  background-color: ${(props):any => props.theme.colors.ARTICLES_TINTCOLOR};
`;

export const WalkthroughButton = styled.View`
  height: 52px;
`;

export const WalkthroughImageContainer = styled.View`
  flex: 2;
  align-items: center;
  flex-direction: row;
  margin-top: 20px;
`;

export const WalkthroughContentArea = styled.View`
  flex: 3;
  flex-direction: column;
  align-items: center;
  align-content: center;
`;
export const WalkBtn = styled.View`
  flex: 1;
 
`;
export default WalkthroughContainer;
