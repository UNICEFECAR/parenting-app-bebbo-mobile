import { DrawerActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text, Button } from 'react-native';
import { Header3Text } from '../../styles/style';


const AdviceAndArticles = ({ navigation }: Props) => {
    return (
        <>
            <View style={{padding:10}}>
            <View>
            <Text>Expert Advice And Articles</Text>
            <View style={{ flex: 1, flexDirection: "row", height: 150 }}>
              <View style={{ flex: 1, backgroundColor: "orange" }} />
              <View style={{ flex: 1, backgroundColor:'purple' }} />
              <View style={{ flex: 1, backgroundColor: "orange" }} />
              <View style={{ flex: 1,  backgroundColor:'purple' }} />
            </View>
          </View>
            </View>
        </>
    );
};

export default AdviceAndArticles;
