import Icon, { OuterIconLeft, OuterIconRow } from '@components/shared/Icon';
import React from 'react';
import { StyleSheet, Text, View } from "react-native";
import { ArticleFilter, FilterBox, FilterText } from './shared/FilterStyle';
import { FlexDirRow } from './shared/FlexBoxStyle';

const ActivitiesCategories = (props:any) => {
    const buttonData = [
        {iconName:'ic_act_emotional',displayName:'Emotional'},
        {iconName:'ic_act_language',displayName:'Language'},
        {iconName:'ic_act_cognitive',displayName:'Cognitive'},
        {iconName:'ic_act_movement',displayName:'Movement'}
      ];
    return (
        <>

            
            <View style={{maxWidth:280,width:'100%',marginLeft:'auto',marginRight:'auto', padding: 10,backgroundColor:props.backgroundColor, minHeight: 120, }}>
                <View style={{ flex: 1, flexDirection: 'row',}}>
                    <View style={styles.item} >
                    <FilterBox>
                    <OuterIconRow>
                         <OuterIconLeft>
                         <Icon style={styles.iconStyle} name={buttonData[0].iconName} size={20} color="#000" />
                         </OuterIconLeft>
                         </OuterIconRow>
                        
                         <FilterText>{buttonData[0].displayName}</FilterText>
                    </FilterBox>
                    </View>
                    <View style={styles.item} >
                    <FilterBox>
                    <OuterIconRow>
                         <OuterIconLeft>
                         <Icon style={styles.iconStyle} name={buttonData[1].iconName} size={20} color="#000" />
                         </OuterIconLeft>
                         </OuterIconRow>
                        
                         <FilterText>{buttonData[1].displayName}</FilterText>
                    </FilterBox>
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={styles.item} >
                <FilterBox>
                <OuterIconRow>
                         <OuterIconLeft>
                         <Icon style={styles.iconStyle} name={buttonData[2].iconName} size={20} color="#000" />
                         </OuterIconLeft>
                         </OuterIconRow>
                        
                         <FilterText>{buttonData[2].displayName}</FilterText>
                    </FilterBox>
                    </View>
                    <View style={styles.item} >
                    <FilterBox>
                    <OuterIconRow>
                         <OuterIconLeft>
                         <Icon style={styles.iconStyle} name={buttonData[3].iconName} size={20} color="#000" />
                         </OuterIconLeft>
                         </OuterIconRow>
                        
                        <FilterText>{buttonData[3].displayName}</FilterText>
                    </FilterBox>
                    </View>
                </View>
            </View>
        </>
    );
};
export default ActivitiesCategories;
const styles = StyleSheet.create({
     iconStyle:{
      
        marginLeft:10
    },
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
   
    // title: {
    //     fontSize: 10,
    //     // padding: 5,
    //     margin: 0,
    //     flex: 2,
    //     width: 120,
    //     fontWeight: 'bold',
    //     justifyContent: 'flex-start'
    // },
})