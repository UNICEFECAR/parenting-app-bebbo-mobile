import "styled-components/native";

// and extend them!
declare module "styled-components/native" {
  export interface DefaultTheme {
    colors: {
      PRIMARY_COLOR: string;
      SECONDARY_RE_COLOR: string;
      PRIMARY_REDESIGN_COLOR: string;
      PRIMARY_RE_TEXTCOLOR: string;
      PRIMARY_TINTCOLOR: string;
      SECONDARY_COLOR: string;
      SECONDARY_TINTCOLOR: string;
      CHILDDEVELOPMENT_COLOR: string;
      CHILDDEVELOPMENT_TINTCOLOR: string;
      VACCINATION_COLOR: string;
      VACCINATION_TINTCOLOR: string;
      HEALTHCHECKUP_COLOR: string;
      HEALTHCHECKUP_TINTCOLOR: string;
      CHILDGROWTH_COLOR: string;
      CHILDGROWTH_TINTCOLOR: string;
      ACTIVITIES_COLOR: string;
      ACTIVITIES_TINTCOLOR: string;
      ARTICLES_COLOR: string;
      ARTICLES_TINTCOLOR: string;
      PRIMARY_TEXTCOLOR: string;
      TERMS_TEXTCOLOR: string;
      SECONDARY_TEXTCOLOR: string;
      LIGHTSHADE_COLOR: string;
      PRIMARY_BLUE_TEXTCOLOR: string;
      SECONDARY_BLUE_TEXTCOLOR: string;
      CHILDDEVELOPMENT_TEXTCOLOR: string;
      VACCINATION_TEXTCOLOR: string;
      HEALTHCHECKUP_TEXTCOLOR: string;
      CHILDGROWTH_TEXTCOLOR: string;
      ACTIVITIES_TEXTCOLOR: string;
      ARTICLES_TEXTCOLOR: string;
      ARTICLES_LIST_BACKGROUND: string;
    };
    fonts: {
      ROBOTO_BOLD: string;
      ROBOTO_REGULAR: string;
    };
    borderRadius: {
      BORDERRADIUS: string;
      BORDERRADIUS_CIRCLE: string;
    };
    isRTL: boolean;
  }
}
