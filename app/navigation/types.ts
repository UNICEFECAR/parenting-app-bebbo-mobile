export type RootStackParamList = {
  Localization: undefined;
  Walkthrough: undefined;
  ChildSetup: undefined;
  ChildImportSetup: {};
  ChildSetupList: undefined;
  AddSiblingDataScreen: {};
  LoadingScreen: {};
  Terms: undefined;
  TermsPage:undefined;
  PrivacyPolicy: undefined;
  HomeDrawerNavigator: HomeDrawerNavigatorStackParamList;
  EditChildProfile:{};
  AddExpectingChildProfile:undefined;
  EditParentDetails:undefined;
  AddNewChildgrowth:undefined;
  ChartFullScreen:undefined;
  AddNewChildWeight:undefined;
  AddNewChildHeight:undefined;
  AddChildVaccination:undefined;
  AddReminder:undefined;
  AddChildHealthCheckup:undefined;
  AllChildgrowthMeasures:undefined;
  DetailsScreen: {};
  ChildProfileScreen: undefined;
};

export type LocalizationStackParamList = {
  CountrySelection: {};
  LanguageSelection: undefined;
  CountryLanguageConfirmation: {};
};

export type HomeDrawerNavigatorStackParamList = {
  Home: {};
  NotificationsScreen: undefined;
  ChildgrowthScreen: undefined;
  ChildDevelopmentScreen: undefined;
  VaccinationScreen: undefined;
  HealthCheckupsScreen: undefined;
  SettingsScreen: undefined;
  AboutusScreen: undefined;  
  UserGuide: undefined;
  Favourites: {};
  SupportChat:undefined;
};

export type DashboardBottomTabParamList = {
  Home: undefined;
  Activities: {};
  Tools: undefined;
  Articles: {};
  ChildDevelopment: {};
};
