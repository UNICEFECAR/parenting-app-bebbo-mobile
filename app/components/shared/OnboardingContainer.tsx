
import styled from 'styled-components/native';
const OnboardingContainer = styled.View`
  width: 100%;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${props => props.theme.colors.PRIMARY_COLOR};
`;
export default OnboardingContainer;