export type RootStackParamList = {
  Localization: undefined;
  Walkthrough: undefined;
  ChildSetup: undefined;
  Terms: undefined;
  HomeDrawerNavigator: HomeDrawerNavigatorStackParamList;
};

export type LocalizationStackParamList = {
  CountrySelection: undefined;
  LanguageSelection: undefined;
  CountryLanguageConfirmation: undefined;
};

export type HomeDrawerNavigatorStackParamList = {
  Home: undefined;
  NotificationsScreen: undefined;
  ChildgrowthScreen: undefined;
  ChildDevelopmentScreen: undefined;
  VaccinationScreen: undefined;
  HealthCheckupsScreen: undefined;
  SettingsScreen: undefined;
};

export type DashboardBottomTabParamList = {
  Home: undefined;
  Activities: undefined;
  Add: undefined;
  Articles: undefined;
  SupportChat: undefined;
};
