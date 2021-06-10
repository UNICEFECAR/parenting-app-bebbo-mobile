import React from 'react';
import { ScrollView, StyleSheet, Text, View } from "react-native"
import VectorImage from 'react-native-vector-image';
import { Header3Text } from "../styles/style"
import Icon from '@components/shared/Icon';

const ArticleCategories = (props:any) => {
    return (
        <>
            <View style={{ padding: 10, minHeight: 130,borderBottomColor: props.borderColor,borderBottomWidth:1,borderTopColor: props.borderColor,borderTopWidth:1}}>
                <View style={{ flex: 1, flexDirection: 'row' }}>

                    <View style={styles.item} >
                        <Icon style={styles.iconStyle} name="ic_artl_play" size={20} color="#000" />
                        <Text style={styles.title}>Playing and Learning</Text>
                    </View>
                    <View style={styles.item} >
                        <Icon style={styles.iconStyle} name="ic_artl_health" size={20} color="#000" />
                        <Text style={styles.title}>Health and Wellbeing</Text>
                    </View>
                    <View style={styles.item}>
                        <Icon style={styles.iconStyle} name="ic_artl_safety" size={20} color="#000" />
                        <Text style={styles.title}>Safety and Protection</Text>
                    </View>

                </View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={styles.item}>
                        <Icon style={styles.iconStyle} name="ic_artl_responsive" size={20} color="#000" />
                        <Text style={styles.title}>Responsive Parenting</Text>
                    </View>
                    <View style={styles.item}>
                        <Icon style={styles.iconStyle} name="ic_artl_parenting" size={20} color="#000" />
                        <Text style={styles.title}>Responsive Parenting</Text>
                    </View>
                    <View style={styles.item}>
                        <Icon style={styles.iconStyle} name="ic_artl_nutrition" size={20} color="#000" />
                        <Text style={styles.title}>Responsive Parenting</Text>
                    </View>
                </View>
            </View>
        </>
    );
};
export default ArticleCategories;
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
        width: 100,
        fontWeight: 'bold',
        justifyContent: 'flex-start'
    },
})