import styled from 'styled-components/native';
const AgeSliderContainer = styled.View`
  background:${(props):any => props.theme.colors.SECONDARY_TEXTCOLOR};
  padding:5px 5px;
  min-height:70px;
  flex-direction:row;
  align-items:center;

  `;
export default AgeSliderContainer;

export const AgeSliderNav = styled.View`
 padding:9px;

  `;

  export const AgeSliderBox = styled.View`
  padding:12px 10px;
  border-radius:${(props):any => props.theme.borderRadius.BORDERRADIUS};
  min-width:95px;
  text-align:center;
  margin: 0 5px;
  justify-content:center;
  align-items:center;
 
   `;
