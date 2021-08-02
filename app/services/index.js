import React from 'react';
import PropTypes from 'prop-types';
import {Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from '@components/shared/Icon';

export const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

export default class ScrollingButtonMenu extends React.Component {

    constructor(props) {
        super(props);

        this.scroll = React.createRef();
        // this.dataSourceCords = JSON.parse(window.localStorage.getItem('dataSourceCords'))  || [];
        // this.dataSourceCords = this.getasyncData();
        this.dataSourceCords = [];
        this.state = {
            index: '',
            scrollindex:'',
            dataSourceCords2:[]
        };
    }
    // getasyncData = async () => {
    //     let userId = '';
    //     try {
    //       userId = await AsyncStorage.getItem('dataSourceCords');
    //       console.log("in getasyncData",userId);
    //       if(userId != [] && userId != "")
    //       {
    //         userId = JSON.parse(userId);
    //       }else {
    //         userId = [];
    //       }
    //     } catch (error) {
    //       // Error retrieving data
    //       console.log(error.message);
    //     }
    //     return userId;
    //   }
    //   savesyncData = async dataSourceCords => {
    //     try {
    //         console.log("in save--",dataSourceCords);
    //       await AsyncStorage.setItem('dataSourceCords', dataSourceCords);
    //     } catch (error) {
    //       // Error retrieving data
    //       console.log(error.message);
    //     }
    //   };
    componentDidUpdate(prevProps) {
        const {selected} = this.props;
        // if (this.props.selected != this.state.index) {
        //     this.setState({index: selected}, () => {
        //         console.log("in componentDidUpdate",selected);
        //         if(this.dataSourceCords.length > 0)
        //             {
        //                 this._scrollTo();
        //             }
        //     });
        // }
    }

    componentDidMount() {
        const {selected} = this.props;
        if (selected) {
            this.setState({index: selected}, () => {
                setTimeout(() => {
                    // console.log(this.dataSourceCords,"in componentDidMount",this.state.index);
                    // if(this.dataSourceCords.length > 0)
                    // {
                        this._scrollTo();
                    // }
                }, 0);
            });
        }
    }

    _scrollTo() {
        const {index, dataSourceCords2} = this.state;
        // console.log(dataSourceCords2[index],"scrolltoindex--",index);
        // console.log("this.dataSourceCords--",this.dataSourceCords);
        const screen1 = screenWidth / 2;
        const elementOffset = this.dataSourceCords[index];
        // console.log(this.dataSourceCords,"elementOffset--",elementOffset);
        if (elementOffset !== undefined && typeof this.scroll.scrollTo == 'function') {
            let x = elementOffset.x - (screen1 - (elementOffset.width / 2));
            this.scroll.scrollTo({
                y: 0,
                x: x,
                animated: true,
            });
            this.setState({scrollindex : index});
        }

    }

    rightArrow(items) {
        const {scrollindex} = this.state;
        let newindex;
        if(scrollindex == '' || scrollindex == 0)
        {
            newindex = items[0 + 2].id;
        }else {
            let innerindex = ((items.findIndex(x => x.id == scrollindex) + 2) < items.length) ? (items.findIndex(x => x.id == scrollindex) + 2) : (items.length - 1)
            newindex = items[innerindex].id
        }
        const screen1 = screenWidth / 2;
        const elementOffset = this.dataSourceCords[newindex];
        if (elementOffset !== undefined && typeof this.scroll.scrollTo == 'function') {
            let x = elementOffset.x - (screen1 - (elementOffset.width / 2));
            this.scroll.scrollTo({
                y: 0,
                x: x,
                animated: true,
            });
            this.setState({scrollindex : newindex});
        }
    }
    leftArrow(items) {
        const {scrollindex} = this.state;
        let newindex;
        if(scrollindex == '' || scrollindex == 0)
        {
            newindex = items[0].id;
        }else {
            let innerindex = ((items.findIndex(x => x.id == scrollindex) - 2) >= 0) ? (items.findIndex(x => x.id == scrollindex) - 2) : (0)
            newindex = items[innerindex].id
        }
        const screen1 = screenWidth / 2;
        const elementOffset = this.dataSourceCords[newindex];
        if (elementOffset !== undefined && typeof this.scroll.scrollTo == 'function') {
            let x = elementOffset.x - (screen1 - (elementOffset.width / 2));
            this.scroll.scrollTo({
                y: 0,
                x: x,
                animated: true,
            });
            this.setState({scrollindex : newindex});
        }
    }

    render() {
        const {items, upperCase, selectedOpacity, activeBackgroundColor, activeColor, buttonStyle, containerStyle, keyboardShouldPersistTaps} = this.props;
        const {index} = this.state;

        return (
            <View style={[
                styles.scrollArea,
                containerStyle,
            ]}>
            <TouchableOpacity style={{padding:11}} onPress={() => this.leftArrow(items)}>
                {/* <Text>L</Text> */}
                <Icon name="ic_angle_left" size={16} color="#000" />
            </TouchableOpacity>
                <ScrollView
                    horizontal={true}
                    pagingEnabled={false}
                    showsHorizontalScrollIndicator={false}
                    ref={(node) => this.scroll = node}
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContainer}
                    scrollEventThrottle={200}
                    lazy={false}
                    keyboardShouldPersistTaps={keyboardShouldPersistTaps}
                >
                    {
                        items.map((route, i) => (
                            <TouchableOpacity
                                style={[
                                    styles.tabItem,
                                    (index === route.id ? styles.tabItemFocused : {}),
                                    (buttonStyle ? buttonStyle : false),
                                    (index === route.id && activeBackgroundColor ? {backgroundColor: activeBackgroundColor} : false),
                                ]}
                                key={(route.id ? route.id : i).toString()}
                                onPress={() => this.setState({index: route.id}, () => setTimeout(() => {
                                    // console.log("in onpress",route.id);
                                        this._scrollTo();
                                        return this.props.onPress(route);
                                    }, 30),
                                )}
                                onLayout={(event) => {
                                    // console.log("event--",event);
                                    const layout = event.nativeEvent.layout;
                                    // console.log(this.dataSourceCords,"--layout--",layout);
                                    if(layout){
                                        this.dataSourceCords[route.id] = layout;
                                        // this.setState({dataSourceCords2:this.dataSourceCords});
                                        this.setState({dataSourceCords2: this.dataSourceCords}, () => setTimeout(() => {
                                            // console.log("in onpress",route.id);
                                                this._scrollTo();
                                                // return this.props.onPress(route);
                                        }, 30),)
                                        // if(this.dataSourceCords)
                                        // {
                                        //     // this.savesyncData(JSON.stringify(this.dataSourceCords))
                                        // }
                                        // window.localStorage.setItem('dataSourceCords', JSON.stringify(state));
                                        // this._scrollTo();
                                    }
                                }}
                                activeOpacity={selectedOpacity}
                            >
                                <Text style={[
                                    styles.tabItemText,
                                    (index == route.id ? styles.tabItemTextFocused : {}),
                                    (index == route.id && activeColor ? {color: activeColor} : false),
                                ]}>
                                    {upperCase ? route.name.toUpperCase() : route.name}
                                </Text>
                            </TouchableOpacity>
                        ))
                    }
                </ScrollView>
            <TouchableOpacity style={{padding:11}} onPress={() => this.rightArrow(items)}>
                <Icon name="ic_angle_right" size={16} color="#000" />
            </TouchableOpacity>
            </View>
        );
    }
}

ScrollingButtonMenu.propTypes = {
    items: PropTypes.array.isRequired,
    onPress: PropTypes.func.isRequired,
    upperCase: PropTypes.bool,
    textStyle: PropTypes.object,
    buttonStyle: PropTypes.object,
    activeColor: PropTypes.string,
    activeBackgroundColor: PropTypes.string,
    selected: PropTypes.number,
    selectedOpacity: PropTypes.number,
    containerStyle: PropTypes.object,
    keyboardShouldPersistTaps: PropTypes.string,
};

ScrollingButtonMenu.defaultProps = {
    upperCase: false,
    textStyle: {
        padding: 10,
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '500',
    },
    buttonStyle: {
        borderRadius: 4,
        marginRight: 10,
    },
    activeColor: '',
    activeBackgroundColor: '#1e1e1e',
    selected: '',
    onPress: () => {

    },
    selectedOpacity: 0.7,
    containerStyle: {},
    keyboardShouldPersistTaps: 'always',
};

const styles = StyleSheet.create({
    scrollArea: {
        paddingTop: 15,
        paddingBottom: 15,
        flexDirection: 'row',
        alignItems:'center'
    },
    scroll: {flex: 9},
    scrollContainer: {},
    tabItem: {
        color:'#000',
        /*borderColor: '#858585',
        borderStyle: 'solid',
        borderWidth: 1,*/
        borderRadius:4,
        padding:12,
        paddingLeft: 15,
        paddingRight: 15,
        marginRight:8,
    },
    tabItemText: {
        color: '#000000',
        // fontFamily: 'AvenirNext-Medium',
        fontSize: 14,
        fontWeight: 'bold',
        fontStyle: 'normal',
        textAlign: 'center',
        lineHeight: 20,
    },
    tabItemFocused: {
        borderWidth: 0,
    },
    tabItemTextFocused: {
        color: '#fff',
    },
});
