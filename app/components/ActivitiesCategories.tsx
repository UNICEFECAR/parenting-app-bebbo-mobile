import Icon from '@components/shared/Icon';
import React from 'react';
import { StyleSheet, Text, View } from "react-native";

const ActivitiesCategories = (props:any) => {
    const buttonData = props.buttonData;
    return (
        <>
            <View style={{ padding: 10,backgroundColor:props.backgroundColor, minHeight: 120,borderBottomColor: props.borderColor,borderBottomWidth:1,paddingHorizontal:70}}>
                <View style={{ flex: 1, flexDirection: 'row' }}>

                    <View style={styles.item} >
                        <Icon style={styles.iconStyle} name={buttonData[0].iconName} size={20} color="#000" />
                        <Text style={styles.title}>{buttonData[0].displayName}</Text>
                    </View>
                    <View style={styles.item} >
                        <Icon style={styles.iconStyle} name={buttonData[1].iconName} size={20} color="#000" />
                        <Text style={styles.title}>{buttonData[1].displayName}</Text>
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={styles.item}>
                        <Icon style={styles.iconStyle} name={buttonData[2].iconName} size={20} color="#000" />
                        <Text style={styles.title}>{buttonData[2].displayName}</Text>
                    </View>
                    <View style={styles.item}>
                        <Icon style={styles.iconStyle} name={buttonData[3].iconName} size={20} color="#000" />
                        <Text style={styles.title}>{buttonData[3].displayName}</Text>
                    </View>
                </View>
            </View>
        </>
    );
};
export default ActivitiesCategories;
const styles = StyleSheet.create({
    item: {
        backgroundColor: '#FFF',
        borderRadius: 5,
        margin: 5,
        // padding: 10,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection:'row',
    },
    iconStyle:{
        flex: 1,
        marginLeft:10
    },
    title: {
        fontSize: 10,
        // padding: 5,
        margin: 0,
        flex: 2,
        width: 120,
        fontWeight: 'bold',
        justifyContent: 'flex-start'
    },
})