import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ThemeContext } from 'styled-components';
import ShareFavButtons from './shared/ShareFavButtons';

const FavActivities = (props: any) => {
  const navigation = useNavigation()
  const DATA = [
    {
      id: '1',
      imagePath: require('@assets/trash/card4.jpeg'),
      title: 'General recommendations for overweight and obese infants',
    },
    {
      id: '2',
      imagePath: require('@assets/trash/card2.jpeg'),
      title: 'General recommendations for overweight and obese infants',
    },
    {
      id: '3',
      imagePath: require('@assets/trash/card3.jpeg'),
      title: 'General recommendations for overweight and obese infants',
    },
    {
      id: '4',
      imagePath: require('@assets/trash/card4.jpeg'),
      title: 'General recommendations for overweight and obese infants',
    },
    {
      id: '5',
      imagePath: require('@assets/trash/card5.jpeg'),
      title: 'General recommendations for overweight and obese infants',
    },
    {
      id: '6',
      imagePath: require('@assets/trash/card6.jpeg'),
      title: 'Picking stuff around',
    },
  ];
  const themeContext = useContext(ThemeContext);
  const actHeaderColor = themeContext.colors.ACTIVITIES_COLOR;
  const actBackgroundColor = themeContext.colors.ACTIVITIES_TINTCOLOR;
 
  const gotoActivity =()=>{
    navigation.navigate('DetailsScreen', {
      fromScreen: 'ChildDevelopment',
      headerColor: actHeaderColor,
      backgroundColor: actBackgroundColor,
    });
  }
  const renderActivityItem = (item: typeof DATA[0], index: number) => (
    <Pressable onPress={gotoActivity} key={index}>
      <View style={styles.item}>
        <Image
          style={styles.cardImage}
          source={item.imagePath}
          resizeMode={'cover'}
        />
        <Text style={styles.label}>Cognitive</Text>
        <Text style={styles.title}>{item.title}</Text>
        <ShareFavButtons  isFavourite={true} backgroundColor={'#FFF'}/>
      </View>
    </Pressable>
  );
  return (
    <>
       <View style={{flex: 1, flexDirection: 'row',backgroundColor:actBackgroundColor}}>
          <ScrollView
         >
            {DATA.map((item, index) => {
              return renderActivityItem(item, index);
            })}
          </ScrollView>
         
        </View>
    </>
  );
};
export default FavActivities;

const styles = StyleSheet.create({
  item: {
    height: '100%',
    backgroundColor: '#FFF',
    // padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
    flex: 1,
  },
  title: {
    fontSize: 16,
    padding: 10,
    // flex: 1,
    color: '#000',
  },
  label: {
    fontSize: 12,
    paddingLeft: 10,
    // flex: 1,
    color: '#000',
  },
  cardImage: {
    height: 200,
    width: '100%',
    // flex: 1,
    // alignSelf: 'center',
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },
});
