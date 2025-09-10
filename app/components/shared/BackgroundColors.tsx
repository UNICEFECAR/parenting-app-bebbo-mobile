import styled from 'styled-components/native';
const BackgroundColors = styled.View`
`;
export default BackgroundColors;


export const BgPrimary = styled.View`
background-color:${(props:any):any => props.theme.colors.PRIMARY_COLOR};
`;
export const BgPrimaryTint = styled.View`
background-color:${(props:any):any => props.theme.colors.PRIMARY_TINTCOLOR};
`;
export const BgSecondary = styled.View`
background-color:${(props:any):any => props.theme.colors.TERTIARY_BG_COLOR};
`;
export const BgSecondaryTint = styled.View`
background-color:${(props:any):any => props.theme.colors.SECONDARY_TINTCOLOR};
`;

export const BgVaccination = styled.View`
background-color:${(props:any):any => props.theme.colors.VACCINATION_COLOR};
`;
export const BgVaccinationTint = styled.View`
background-color:${(props:any):any => props.theme.colors.VACCINATION_TINTCOLOR};
`;
export const BgHealth = styled.View`
background-color:${(props:any):any => props.theme.colors.HEALTHCHECKUP_COLOR};
`;
export const BgHealthTint = styled.View`
background-color:${(props:any):any => props.theme.colors.HEALTHCHECKUP_TINTCOLOR};
`;

export const BgGrowth = styled.View`
background-color:${(props:any):any => props.theme.colors.CHILDGROWTH_COLOR};
`;
export const BgGrowthTint = styled.View`
background-color:${(props:any):any => props.theme.colors.CHILDGROWTH_TINTCOLOR};
`;
export const BgDevelopment = styled.View`
background-color:${(props:any):any => props.theme.colors.CHILDDEVELOPMENT_COLOR};
`;
export const BgDevelopmentTint = styled.View`
background-color:${(props:any):any => props.theme.colors.CHILDDEVELOPMENT_TINTCOLOR};
`;

export const BgArticles = styled.View`
background-color:${(props:any):any => props.theme.colors.ARTICLES_COLOR};
`;
export const BgArticlesTint = styled.View`
background-color:${(props:any):any => props.theme.colors.ARTICLES_TINTCOLOR};
`;
export const BgActivity = styled.View`
background-color:${(props:any):any => props.theme.colors.ACTIVITIES_COLOR};
`;
export const BgActivityTint = styled.View`
background-color:${(props:any):any => props.theme.colors.ACTIVITIES_TINTCOLOR};
`;

export const BgWhite = styled.View`
background-color:${(props:any):any => props.theme.colors.SECONDARY_TEXTCOLOR};
`;