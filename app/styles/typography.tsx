
import styled from 'styled-components/native';


/*Heading 1 Styles */

export const Heading1 = styled.Text`
  font-size: 24px;
  line-height: 32px;
  color: ${(props:any):any => props.theme.colors.PRIMARY_TEXTCOLOR};
  fontFamily: 'roboto-bold';
  text-align:left;
`;
export const Heading1w = styled(Heading1)`
  color: ${(props:any):any => props.theme.colors.PRIMARY_RE_TEXTCOLOR};
`;

export const Heading1Center = styled(Heading1)`
text-align: center;
`
export const Heading1Centerw = styled(Heading1w)`
text-align: center;
`
export const Heading1Centerr = styled(Heading1Center)`
fontFamily: 'roboto-regular';
`

export const Heading1Centerrw = styled(Heading1Centerw)`
fontFamily: 'roboto-regular';
`
export const Heading1Regular = styled(Heading1)`
fontFamily: 'roboto-regular';
`

/*Heading 1 Styles */

/*Heading 2 Styles */
export const Heading2 = styled.Text`
  font-size: 20px;
  line-height: 26px;
  color: ${(props:any):any => props.theme.colors.PRIMARY_TEXTCOLOR};
  fontFamily: 'roboto-bold';
  text-align:left;
  `;

export const Heading2w = styled(Heading2)`
color: ${(props:any):any => props.theme.colors.PRIMARY_RE_TEXTCOLOR};
`;

export const Heading2Center = styled(Heading2)`
text-align: center;
`
export const Heading2Centerw = styled(Heading2w)`
text-align: center;
`
export const Heading2Centerr = styled(Heading2Center)`
fontFamily: 'roboto-regular';
`

export const Heading2Centerrw = styled(Heading2Centerw)`
fontFamily: 'roboto-regular';
`
export const Heading2Regular = styled(Heading2)`
fontFamily: 'roboto-regular';
`
/*Heading 2 Styles */

/*Heading 3 Styles */
export const Heading3 = styled.Text`
  font-size: 16px;
  line-height: 20px;
  color: ${(props:any):any => props.theme.colors.PRIMARY_TEXTCOLOR};
  fontFamily: 'roboto-bold';
  text-align:left;
`
export const Heading3w = styled(Heading3)`
color: ${(props:any):any => props.theme.colors.PRIMARY_RE_TEXTCOLOR};
fontFamily: 'roboto';
`
export const HeadingHome3w = styled(Heading3)`
color: ${(props:any):any => props.theme.colors.SECONDARY_TEXTCOLOR};
fontFamily: 'roboto';
`

export const Heading3Center = styled(Heading3)`
text-align: center;
`
export const Heading3Centerw = styled(Heading3w)`
text-align: center;
`
export const Heading3Centerr = styled(Heading3Center)`
fontFamily: 'roboto-regular';
`

export const Heading3Centerrw = styled(Heading3Centerw)`
fontFamily: 'roboto-regular';
`

export const Heading3BoldCenterrw = styled(Heading3Centerw)`
fontFamily: 'roboto-bold';
`

export const Heading3Regular = styled(Heading3)`
fontFamily: 'roboto-regular';
`
export const Heading3Regularw = styled(Heading3Regular)`
color: ${(props:any):any => props.theme.colors.SECONDARY_TEXTCOLOR};
`

/*Heading 3 Styles */


export const Heading4 = styled.Text`
  font-size: 14px;
  line-height: 18px;
  color: ${(props:any):any => props.theme.colors.PRIMARY_TEXTCOLOR};
  fontFamily: 'roboto-bold';
  
`;

export const Heading4w = styled(Heading4)`
color: ${(props:any):any => props.theme.colors.PRIMARY_RE_TEXTCOLOR};
`

export const Heading4Center = styled(Heading4)`
text-align: center;
`
export const Heading4Centerw = styled(Heading4w)`
text-align: center;
`
export const HeadingChatCenterw = styled(Heading4w)`
text-align: center;
color: ${(props:any):any => props.theme.colors.SECONDARY_TEXTCOLOR};
`
export const Heading4Centerr = styled(Heading4Center)`
fontFamily: 'roboto-regular';
`

export const Heading4Centerrw = styled(Heading4Centerw)`
fontFamily: 'roboto-regular';
`
export const Heading4Regular = styled(Heading4)`
fontFamily: 'roboto-regular';
`
export const Heading4RegularP = styled(Heading4)`
fontFamily: 'roboto-regular';
padding:5px;
`
export const Heading1P = styled(Heading1)`
padding:5px;
text-align:center;
`
export const Heading4Bold = styled(Heading4)`
fontFamily: 'roboto-bold';
`
export const Heading4Regularw = styled(Heading4w)`
fontFamily: 'roboto-regular';
`

export const Heading5 = styled.Text`
  font-size: 12px;
  line-height: 16px;
  color: ${(props:any):any => props.theme.colors.PRIMARY_TEXTCOLOR};
  fontFamily: 'roboto-regular';
  text-align:left;
`;
export const Heading5w = styled(Heading5)`
  color: ${(props:any):any => props.theme.colors.SECONDARY_TEXTCOLOR};
`;

export const Heading5Bold = styled(Heading5)`
  fontFamily: 'roboto-bold';
`;

export const Heading5BoldW = styled(Heading5)`
color: ${(props:any):any => props.theme.colors.SECONDARY_TEXTCOLOR};
`;

export const Heading5BoldWh = styled(Heading5)`
color: ${(props:any):any => props.theme.colors.SECONDARY_TEXTCOLOR};
fontFamily: 'roboto-bold';
`;

export const Heading6 = styled.Text`
  font-size: 11px;
  line-height: 14px;
  color: ${(props:any):any => props.theme.colors.PRIMARY_TEXTCOLOR};
  fontFamily: 'roboto-regular';
  text-align:left;
`;
export const Heading6w = styled(Heading6)`
  color: ${(props:any):any => props.theme.colors.SECONDARY_TEXTCOLOR};
`;

export const Heading6Bold = styled(Heading6)`
  fontFamily: 'roboto-bold';
`;




export const Paragraph = styled.Text`
  font-size: 14px;
  line-height: 18px;
  color: ${(props:any):any => props.theme.colors.PRIMARY_TEXTCOLOR};
  fontFamily: 'roboto-regular';
  margin-bottom:15px;
`;
export const Paragraphw = styled(Paragraph)`
  color: ${(props:any):any => props.theme.colors.SECONDARY_TEXTCOLOR};
`;






export const HeadingRegular = styled.Text`
fontFamily: 'roboto-regular';
`

export const ShiftFromBottom5 = styled.View`
margin-bottom:5px;
`
export const ShiftFromBottom10 = styled.View`
margin-bottom:10px;
`
export const ShiftFromBottom15 = styled.View`
margin-bottom:15px;
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
export const ShiftFromTop5 = styled.View`
margin-top:5px;
`
export const ShiftFromTop10 = styled.View`
margin-top:10px;
`
export const ShiftFromTop15 = styled.View`
margin-top:15px;
`
export const ShiftFromTop20 = styled.View`
margin-top:20px;

`
export const ShiftFromTop25 = styled.View`
margin-top:25px;

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
export const ShiftFromTopPercentage = styled.View`
margin-top:25%;
`
export const ShiftFromTopBottom5 = styled.View`
margin-bottom:5px;
margin-top:5px;
`
export const ShiftFromTopBottom10 = styled.View`
margin-bottom:10px;
margin-top:10px;
`
export const ShiftFromTopBottom15 = styled.View`
margin-bottom:15px;
margin-top:15px;
`
export const ShiftFromTopBottom20 = styled.View`
margin-bottom:20px;
margin-top:20px;
`
export const SideSpacing5 = styled.View`
margin-left:5px;
margin-right:5px;
`
export const SideSpacing10 = styled.View`
margin-left:10px;
margin-right:10px;
`
export const SideSpacing15 = styled.View`
margin-left:15px;
margin-right:15px;
`
export const SideSpacing20 = styled.View`
margin-left:20px;
margin-right:20px;
`
export const SideRightSpacing20 = styled.View`
margin-right:20px;
`
export const SideSpacing25 = styled.View`
margin-left:25px;
margin-right:25px;
`
export const SideSpacing30 = styled.View`
margin-left:30px;
margin-right:30px;
`