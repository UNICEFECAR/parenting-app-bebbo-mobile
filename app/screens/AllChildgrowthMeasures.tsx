import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { RootStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext } from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Timeline from 'react-native-timeline-flatlist';
import { ThemeContext } from 'styled-components';
type ChildSetupNavigationProp = StackNavigationProp<RootStackParamList>;

type Props = {
  navigation: ChildSetupNavigationProp;
};

const AllChildgrowthMeasures = ({navigation}: Props) => {
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.CHILDGROWTH_COLOR;
  const backgroundColor = themeContext.colors.CHILDGROWTH_TINTCOLOR;
  const DATA = [
    {
      duration: '2 Months',
      measurementDate: new Date(),
      weight: 5,
      length: 50,
    },
    {
      duration: 'Birth',
      measurementDate: new Date(),
      weight: 3.5,
      length: 40,
    },
  ];
  const data = [
    {
      time: '09:00',
      title: 'Archery Training',
      description:
        'The Beginner Archery and Beginner Crossbow course does not require you to bring any equipment, since everything you need will be provided for the course. ',
      lineColor: '#009688',
      imageUrl:
        'https://cloud.githubusercontent.com/assets/21040043/24240340/c0f96b3a-0fe3-11e7-8964-fe66e4d9be7a.jpg',
    },
    {
      time: '10:45',
      title: 'Play Badminton',
      description:
        'Badminton is a racquet sport played using racquets to hit a shuttlecock across a net.',
      imageUrl:
        'https://cloud.githubusercontent.com/assets/21040043/24240405/0ba41234-0fe4-11e7-919b-c3f88ced349c.jpg',
    },
    {
      time: '12:00',
      title: 'Lunch',
    },
    {
      time: '14:00',
      title: 'Watch Soccer',
      description:
        'Team sport played between two teams of eleven players with a spherical ball. ',
      lineColor: '#009688',
      imageUrl:
        'https://cloud.githubusercontent.com/assets/21040043/24240419/1f553dee-0fe4-11e7-8638-6025682232b1.jpg',
    },
    {
      time: '16:30',
      title: 'Go to Fitness center',
      description: 'Look out for the Best Gym & Fitness Centers around me :)',
      imageUrl:
        'https://cloud.githubusercontent.com/assets/21040043/24240422/20d84f6c-0fe4-11e7-8f1d-9dbc594d0cfa.jpg',
    },
  ];
  const renderDetail = (rowData, sectionID, rowID) => {
    let title = <Text style={[styles.title]}>{rowData.title}</Text>;
    var desc = null;
    if (rowData.description && rowData.imageUrl)
      desc = (
        <View style={styles.descriptionContainer}>
          <Image source={{uri: rowData.imageUrl}} style={styles.image} />
          <Text style={[styles.textDescription]}>{rowData.description}</Text>
        </View>
      );

    return (
      <View style={{flex: 1}}>
        {title}
        {desc}
      </View>
    );
  };

  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: headerColor}}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <View
          style={{
            flexDirection: 'column',
            flex: 1,
          }}>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              backgroundColor: headerColor,
              maxHeight: 50,
              borderBottomColor: 'gray',
              borderBottomWidth: 2,
            }}>
            <View style={{flex: 1}}>
              <Pressable
                onPress={() => {
                  navigation.goBack();
                }}>
                <Text>Back</Text>
              </Pressable>
            </View>
            <View style={{flex: 3}}>
              <Text> {'All Child Measurements'}</Text>
            </View>
          </View>
          <View
            style={{
              flex: 9,
              backgroundColor: backgroundColor,
              padding: 20,
              maxHeight: '100%',
            }}>
            <Timeline
              data={data}
              circleSize={20}
              circleColor={headerColor}
              lineColor="#000"
              showTime={false}
              descriptionStyle={{color: 'gray'}}
              renderDetail={renderDetail}
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default AllChildgrowthMeasures;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 65,
    backgroundColor: 'white',
  },
  list: {
    flex: 1,
    marginTop: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  descriptionContainer: {
    flexDirection: 'row',
    paddingRight: 50,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textDescription: {
    marginLeft: 10,
    color: 'gray',
  },
});
