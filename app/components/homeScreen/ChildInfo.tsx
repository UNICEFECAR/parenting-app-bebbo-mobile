import { DrawerActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text, Button } from 'react-native';
import { Header3Text } from '../../styles/style';


const ChildInfo = ({ navigation }: Props) => {
    return (
        <>
            <View style={{padding:10,backgroundColor:'gray'}}>
                <Header3Text>Your Child's Development</Header3Text>
                <View style={{
                    backgroundColor: '#f9c2ff',
                    padding: 20,
                    marginVertical: 8,
                    marginHorizontal: 16,
                }}>
                    <Text >{'Child Photo'}</Text>
                </View>
                <Header3Text>your baby is 3 month Old</Header3Text>
                <Header3Text>your baby can likely roll from front to back and hold their head with fewer wobbles these days</Header3Text>
                <Button
                    title="Read more"
                    onPress={() => { }}
                />
            </View>
        </>
    );
};

export default ChildInfo;
