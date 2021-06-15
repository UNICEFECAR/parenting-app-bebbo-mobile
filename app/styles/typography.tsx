
import styled from 'styled-components/native';

export const Heading1 = styled.Text`
  font-size: 24px;
  line-height: 32px;
  color: ${props => props.theme.colors.PRIMARY_TEXTCOLOR};
  font-family: 'roboto-bold';
  margin-bottom:15px;
`;
export const Heading1w = styled(Heading1)`
  color: ${props => props.theme.colors.SECONDARY_TEXTCOLOR};
`;

export const Heading2 = styled.Text`
  font-size: 20px;
  line-height: 26px;
  color: ${props => props.theme.colors.PRIMARY_TEXTCOLOR};
  font-family: 'roboto-bold';
  margin-bottom:10px;
  `;
export const Heading2w = styled(Heading2)`
  color: ${props => props.theme.colors.SECONDARY_TEXTCOLOR};
`;

export const Heading3 = styled.Text`
  font-size: 16px;
  line-height: 22px;
  color: ${props => props.theme.colors.PRIMARY_TEXTCOLOR};
  font-family: 'roboto-bold';
  margin-bottom:10px;
`;
export const Heading3w = styled(Heading3)`
  color: ${props => props.theme.colors.SECONDARY_TEXTCOLOR};
`;

export const Heading4 = styled.Text`
  font-size: 14px;
  line-height: 18px;
  color: ${props => props.theme.colors.PRIMARY_TEXTCOLOR};
  font-family: 'roboto-bold';
  margin-bottom:10px;
`;
export const Heading4w = styled(Heading4)`
  color: ${props => props.theme.colors.SECONDARY_TEXTCOLOR};
`;

export const Heading5 = styled.Text`
  font-size: 12px;
  line-height: 16px;
  color: ${props => props.theme.colors.PRIMARY_TEXTCOLOR};
  font-family: 'roboto-regular';
  margin-bottom:10px;
`;
export const Heading5w = styled(Heading5)`
  color: ${props => props.theme.colors.SECONDARY_TEXTCOLOR};
`;

export const Heading6 = styled.Text`
  font-size: 11px;
  line-height: 14px;
  color: ${props => props.theme.colors.PRIMARY_TEXTCOLOR};
  font-family: 'roboto-regular';
  margin-bottom:10px;
`;
export const Heading6w = styled(Heading6)`
  color: ${props => props.theme.colors.SECONDARY_TEXTCOLOR};
`;

export const Paragraph = styled.Text`
  font-size: 14px;
  line-height: 18px;
  color: ${props => props.theme.colors.PRIMARY_TEXTCOLOR};
  font-family: 'roboto-regular';
  margin-bottom:15px;
`;
export const Paragraphw = styled(Paragraph)`
  color: ${props => props.theme.colors.SECONDARY_TEXTCOLOR};
`;

export const Heading1Centerw = styled(Heading1w)`
text-align: center;
`
export const Heading2Centerw = styled(Heading2w)`
text-align: center;
`
export const Heading3Centerw = styled(Heading3w)`
text-align: center;
`
export const Heading3Regular = styled(Heading3)`
font-family: 'roboto-regular';
`
export const HeadingRegular = styled.Text`
font-family: 'roboto-regular';
`

export const ShiftFromBottom10 = styled.View`
margin-bottom:10px;
`
export const ShiftFromBottom20 = styled.View`
margin-bottom:20px;
`
export const ShiftFromBottom30 = styled.View`
margin-bottom:30px;
`
export const ShiftFromBottom40 = styled.View`
margin-bottom:40px;
`
export const ShiftFromBottom50 = styled.View`
margin-bottom:50px;
`
export const ShiftFromTop10 = styled.View`
margin-top:10px;
`
export const ShiftFromTop20 = styled.View`
margin-top:20px;
`
export const ShiftFromTop30 = styled.View`
margin-top:30px;
`
export const ShiftFromTop40 = styled.View`
margin-top:40px;
`
export const ShiftFromTop50 = styled.View`
margin-top:50px;
`