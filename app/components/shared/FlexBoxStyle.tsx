import styled from 'styled-components/native';
const FlexBoxStyle = styled.View`
`;
export default FlexBoxStyle;

export const FlexDirRow = styled.View`
flex-direction:row;
flex:1;
align-items:center;
`;

export const FlexDirRowSpace = styled.View`
flex-direction:row;
justify-content:space-between;
align-items:center;

`;
export const FlexFDirRowSpace = styled(FlexDirRowSpace)`
flex:1;

`;


export const FlexDirRowSpaceStart = styled(FlexDirRowSpace)`
align-items:flex-start;
`;

export const FlexCol = styled.View`
flex-direction:column;
flex:1;
`;
export const FlexRow = styled.View`
flex-direction:row;
flex:1;
`;

export const FlexColChart = styled(FlexCol)`
background-color: ${(props: any): any => props.theme?.colors?.CHILDGROWTH_TINTCOLOR};
marginLeft: -20px;
marginRight: -20px;
`;
export const FlexColEnd = styled(FlexCol)`
alignItems:flex-end;
`;

export const FlexDirCol = styled.View`
flex-direction:column;
flex:1;
justify-content:center;
align-items:center;
`;
export const FlexDirColStart = styled(FlexDirCol)`
align-items:flex-start;
`;

export const FDirCol = styled.View`
flex-direction:column;
`;

export const Flex_5 = styled.View`
flex:.25;
`;
export const FlexDirRowStart = styled(FlexDirRow)`
align-items:flex-start;
`;
export const FlexDirRowEnd = styled(FlexDirRow)`

justify-content:flex-end;
`;

export const FlexRowEnd = styled.View`
flex-direction:row;
flex:1;
justify-content:flex-end;
`;

export const FDirRow = styled.View`
flex-direction:row;
align-items:center;

`;

export const FDirRowStart = styled(FDirRow)`
align-items:flex-start;
`;

export const Flex1 = styled.View`
flex:1;
`;
export const Flex2 = styled.View`
flex:2;
`;
export const Flex3 = styled.View`
flex:3;
`;
export const Flex4 = styled.View`
flex:4;
`;
export const Flex5 = styled.View`
flex:5;
`;
export const Flex6 = styled.View`
flex:6;
`;

export const FlexShrink = styled.View`
flex-shrink:1;padding:0 3px;

`;


