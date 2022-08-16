import 'styled-components/native';

// and extend them!
declare module 'styled-components/native' {
  export interface DefaultTheme {

    colors: {
        PRIMARY_COLOR: string;
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
        ARTICLES_COLOR:string;
        ARTICLES_TINTCOLOR: string;
        PRIMARY_TEXTCOLOR: string;
        SECONDARY_TEXTCOLOR: string;
        LIGHTSHADE_COLOR: string;
    };
    fonts:{
      ROBOTO_BOLD: string;
      ROBOTO_REGULAR: string;
    };
    borderRadius:{
        BORDERRADIUS: string;
        BORDERRADIUS_CIRCLE: string;
        
    };
    isRTL:boolean;
  }
}