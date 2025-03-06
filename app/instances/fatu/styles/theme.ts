import { I18nManager } from "react-native";

export const appTheme= {
    colors: {
        PRIMARY_COLOR: '#2B2F84',
        PRIMARY_REDESIGN_COLOR: '#FAFAFA',
        PRIMARY_TINTCOLOR: '#B3E7FA',
        SECONDARY_COLOR: '#00AEEF',
        SECONDARY_RE_COLOR: ' #1CABE2',
        SECONDARY_TINTCOLOR: '#B3E7FA',
        CHILDDEVELOPMENT_COLOR: '#FFC20E',
        CHILDDEVELOPMENT_TINTCOLOR: '#FFEDB7',
        VACCINATION_COLOR: '#00A8A8',
        VACCINATION_TINTCOLOR: '#99DCDC',
        HEALTHCHECKUP_COLOR: '#F6A7D7',
        HEALTHCHECKUP_TINTCOLOR: '#FCE5F3',
        CHILDGROWTH_COLOR: '#AB8AD5',
        CHILDGROWTH_TINTCOLOR: '#D5C4EA',
        ACTIVITIES_COLOR: '#0FD87E',
        ACTIVITIES_TINTCOLOR: '#CFF7E5',
        ARTICLES_COLOR: '#FF8D6B',
        ARTICLES_TINTCOLOR: '#FFD2C4',
        PRIMARY_TEXTCOLOR: '#000000',
        PRIMARY_RE_TEXTCOLOR: '#2D2926',
        TERMS_TEXTCOLOR: '#777779',
        SECONDARY_TEXTCOLOR: '#ffffff',
        LIGHTSHADE_COLOR: '#F7F6F4',
    },
    fonts: {
        ROBOTO_BOLD: 'roboto-bold',
        ROBOTO_REGULAR: 'roboto-regular'
    },
    borderRadius:{
        BORDERRADIUS:'4px',
        BORDERRADIUS_CIRCLE:'100px'
    },
    isRTL:I18nManager.isRTL
};

