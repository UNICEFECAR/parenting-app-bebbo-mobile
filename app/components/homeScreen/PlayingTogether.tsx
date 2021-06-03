import { DrawerActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text, Button } from 'react-native';
import { Header3Text } from '../../styles/style';


const PlayingTogether = ({ navigation }: Props) => {
    return (
        <>
            <View style={{padding:10,}}>
            <View>
            <Text>Playing together</Text>
            <View style={{ flex: 1, flexDirection: "row", height: 150 }}>
              <View style={{ flex: 2, backgroundColor: "red" }} />
              <View style={{ flex: 3, flexDirection: 'column' }} >
                <View style={{ flex: 2, backgroundColor: "yellow" }} >
                  <Header3Text>Here are some interesting activities, you can play with your child</Header3Text>
                </View>
                <View style={{ flex: 3, backgroundColor: "green" }} >
                  <Text>Start Playing</Text>
                </View>
              </View>
            </View>
          </View>
            </View>
        </>
    );
};

export default PlayingTogether;
