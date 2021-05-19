import React from 'react';
import {View, Button, StyleSheet} from 'react-native';
const TabScreenHeader = () => {
  return (
    <View style={styles.container}>
      <View style={styles.top} />
    </View>
  );
};
export default TabScreenHeader;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'space-between',
    backgroundColor: '#fff',
    height: 12,
  },
  top: {
    flex: 1,
    backgroundColor: 'grey',
    borderWidth: 1,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
});
