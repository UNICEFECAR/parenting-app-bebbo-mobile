import AsyncStorage from "@react-native-async-storage/async-storage";

const getKey = (countryId: number | string) =>
  `country_app_update_${countryId}`;

export const getCachedCountryAppUpdate = async (
  countryId: number | string
) => {
  try {
    const value = await AsyncStorage.getItem(getKey(countryId));
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.log("Unable to read cached country app update:", error);
    return null;
  }
};

export const saveCachedCountryAppUpdate = async (
  countryId: number | string,
  appUpdate: any
) => {
  try {
    await AsyncStorage.setItem(
      getKey(countryId),
      JSON.stringify(appUpdate)
    );
  } catch (error) {
    console.log("Unable to save cached country app update:", error);
  }
};