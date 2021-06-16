import ActivitiesCategories from '@components/ActivitiesCategories';
import AgeBrackets from '@components/AgeBrackets';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import Icon from '@components/shared/Icon';
import TabScreenHeader from '@components/TabScreenHeader';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading3 } from '@styles/typography';
import React, { useContext } from 'react';
import {
  Image, Pressable, ScrollView, StyleSheet, Text, View
} from 'react-native';
import styled, { ThemeContext } from 'styled-components/native';
type ActivitiesNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  navigation: ActivitiesNavigationProp;
};

const DATA = [
  {
    id: '1',
    imagePath: require('@assets/trash/card1.jpeg'),
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
const ContainerView = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props) => props.theme.colors.ACTIVITIES_TINTCOLOR};
`;
const SuggestedActivities = () => {
  return (
    <View style={{padding: 10, height: 400, marginBottom: 30}}>
      <Heading3>Suggested Activities</Heading3>
      <View style={styles.item}>
        <Image
          style={styles.cardImage}
          source={require('@assets/trash/card5.jpeg')}
          resizeMode={'cover'}
        />
        <View>
          <Text style={styles.label}>Play and learning</Text>
          <Text style={styles.title}>
            {'General recommendations for overweight and obese infants'}
          </Text>
        </View>
        <View style={{flexDirection: 'row', padding: 10}}>
          <View>
            <Text>{'Pending Milestones'}</Text>
            <Text>{'Laugh at Human face'}</Text>
          </View>
          <View>
            <Text style={{borderBottomWidth: 1}}>Track Milestone</Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', padding: 10}}>
          <View style={{flex: 1}}>
            <Pressable onPress={() => {}} style={{flexDirection: 'row'}}>
              <Icon name="ic_sb_shareapp" size={20} color="#000" />
              <Text>Share</Text>
            </Pressable>
          </View>
          <View style={{flex: 1}}>
            <Pressable onPress={() => {}} style={{flexDirection: 'row'}}>
              <Icon name="ic_sb_favorites" size={20} color="#000" />
              <Text>Add to favourites</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};
const Activities = ({navigation}: Props) => {
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.ACTIVITIES_COLOR;
  const backgroundColor = themeContext.colors.ACTIVITIES_TINTCOLOR;
  const onPress = () => {
    navigation.navigate('ActivityDetails');
  };
  const renderActivityItem = (item: typeof DATA[0], index: number) => (
    <Pressable onPress={onPress} key={index}>
      <View style={styles.item}>
        <Image
          style={styles.cardImage}
          source={item.imagePath}
          resizeMode={'cover'}
        />
        <Text style={styles.label}>Cognitive</Text>
        <Text style={styles.title}>{item.title}</Text>
        <View style={{flexDirection: 'row', padding: 10}}>
          <View style={{flex: 1}}>
            <Pressable onPress={() => {}} style={{flexDirection: 'row'}}>
              <Icon name="ic_sb_shareapp" size={20} color="#000" />
              <Text>Share</Text>
            </Pressable>
          </View>
          <View style={{flex: 1}}>
            <Pressable onPress={() => {}} style={{flexDirection: 'row'}}>
              <Icon name="ic_sb_favorites" size={20} color="#000" />
              <Text>Add to favourites</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  );
  
  return (
    <>
      <ContainerView>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <ScrollView nestedScrollEnabled={true}>
        <TabScreenHeader
          title="Activities"
          headerColor={headerColor}
          textColor="#000"
        />
        <View style={{flex: 1, flexDirection: 'column'}}>
          <AgeBrackets itemColor={backgroundColor} activatedItemColor={headerColor}/>
          <ActivitiesCategories
            borderColor={headerColor}
            backgroundColor={backgroundColor}
          />
         
            <SuggestedActivities />
            <Heading3>Other Activities</Heading3>

            {DATA.map((item, index) => {
              return renderActivityItem(item, index);
            })}
            {/* <FlatList
            nestedScrollEnabled={true}
              data={DATA}
              // contentContainerStyle={{height: DATA.length * 400}}
              renderItem={({item, index}) => renderActivityItem(item, index)}
              keyExtractor={(item) => item.id}
            /> */}
          
        </View>
        </ScrollView>
      </ContainerView>
    </>
  );
};

export default Activities;

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
