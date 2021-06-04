import React from 'react';
import { View } from "react-native"
import { Header3Text } from "../styles/style"

const ArticleCategories = () => {
    return (
        <>
        <View style={{padding:10, flex: 1,minHeight:80}}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 1, backgroundColor: "red" }} />
                <View style={{ flex: 1, backgroundColor: "darkorange" }} />
                <View style={{ flex: 1, backgroundColor: "green" }} />
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 1, backgroundColor: "yellow" }} />
                <View style={{ flex: 1, backgroundColor: "purple" }} />
                <View style={{ flex: 1, backgroundColor: "gray" }} />
            </View>
        </View>
        </>
    );
};
export default ArticleCategories;