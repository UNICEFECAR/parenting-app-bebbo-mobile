import Icon from '@components/shared/Icon';
import React from 'react';
import { StyleSheet, Text, View } from "react-native";

const ActivitiesCategories = (props:any) => {
    return (
        <>
            <View style={{ padding: 10,backgroundColor:props.backgroundColor, minHeight: 120,borderBottomColor: props.borderColor,borderBottomWidth:1,paddingHorizontal:70}}>
                <View style={{ flex: 1, flexDirection: 'row' }}>

                    <View style={styles.item} >
                        <Icon style={styles.iconStyle} name="ic_act_emotional" size={20} color="#000" />
                        <Text style={styles.title}>Emotional</Text>
                    </View>
                    <View style={styles.item} >
                        <Icon style={styles.iconStyle} name="ic_act_language" size={20} color="#000" />
                        <Text style={styles.title}>Language</Text>
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={styles.item}>
                        <Icon style={styles.iconStyle} name="ic_act_cognitive" size={20} color="#000" />
                        <Text style={styles.title}>Cognitive</Text>
                    </View>
                    <View style={styles.item}>
                        <Icon style={styles.iconStyle} name="ic_act_movement" size={20} color="#000" />
                        <Text style={styles.title}>Movement</Text>
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