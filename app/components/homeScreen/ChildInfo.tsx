import { Header3Text } from '@styles/style';
import React from 'react';
import { Button, Image, View } from 'react-native';


const ChildInfo = () => {
    return (
        <>
            <View style={{padding:10}}>
                <Header3Text>Your Child's Development</Header3Text>
                <View style={{
                    marginVertical: 8,
                    marginHorizontal: 16,
                }}>
                    <Image source={require('@assets/trash/card5.jpeg')} style={{width:'100%',borderRadius:10}}/>
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
