import React from 'react';
import PropTypes from 'prop-types';
import {Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import  { IconML } from '@components/shared/Icon';
import { bgcolorBlack2, bgcolorWhite2 } from '@styles/style';

export const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
const styles = StyleSheet.create({
    scroll: {flex: 9},
    scrollArea: {
        alignItems:'center',
        flexDirection: 'row',
        paddingBottom: 15,
        paddingTop: 15
    },
    scrollContainer: {},
    tabItem: {
        borderRadius:4,
        color:bgcolorBlack2,
        marginRight:8,
        padding:12,
        paddingLeft: 15,
        paddingRight: 15,
    },
    tabItemFocused: {
        borderWidth: 0,
    },
    tabItemText: {
        color: bgcolorBlack2,
        fontSize: 14,
        fontStyle: 'normal',
        fontWeight: 'bold',
        lineHeight: 20,
        textAlign: 'center',
    },
    tabItemTextFocused: {
        color: bgcolorWhite2,
    },
    touchableFlex: {
        padding:11
    }
});

export default class ScrollingButtonMenu extends React.Component {

    constructor(props) {
        super(props);

        this.scroll = React.createRef();
        this.dataSourceCords = [];
        this.state = {
            index: '',
            scrollindex:'',
            scrollindexarrow:'',
            dataSourceCords2:[]
        };
    }
   
    componentDidUpdate(prevProps) {
        const { selected } = this.props;
        if (selected !== this.state.index && selected !== prevProps.selected) {
            this.setState({ index: selected }, this._scrollTo);
        }
    }
    

    componentDidMount() {
        const {selected} = this.props;
        console.log('selected props is',selected)
        if (selected) {
            this.setState({index: selected}, () => {
                setTimeout(() => {
                        this._scrollTo();
                
                }, 0);
            });
        }
    }

    _scrollTo() {
        const {index,scrollindex} = this.state;
        if(index != scrollindex)
        {
            const screen1 = screenWidth / 2;
            const elementOffset = this.dataSourceCords[index];
            if (elementOffset !== undefined && typeof this.scroll.scrollTo == 'function') {
                const x = elementOffset.x - (screen1 - (elementOffset.width / 2));
                this.scroll.scrollTo({
                    y: 0,
                    x: x,
                    animated: true,
                });
                this.setState({scrollindex : index});
                this.setState({scrollindexarrow : index});
            }
        }
    }

    rightArrow(items) {
        const {scrollindexarrow} = this.state;
        let newindex;
        if(scrollindexarrow == '' || scrollindexarrow == 0)
        {
            newindex = items[0 + 2].id;
        }else {
            const innerindex = ((items.findIndex(x => x.id == scrollindexarrow) + 2) < items.length) ? (items.findIndex(x => x.id == scrollindexarrow) + 2) : (items.length - 1)
            newindex = items[innerindex].id
        }
        const screen1 = screenWidth / 2;
        const elementOffset = this.dataSourceCords[newindex];
        if (elementOffset !== undefined && typeof this.scroll.scrollTo == 'function') {
            const x = elementOffset.x - (screen1 - (elementOffset.width / 2));
            this.scroll.scrollTo({
                y: 0,
                x: x,
                animated: true,
            });
            this.setState({scrollindexarrow : newindex});
        }
    }
    leftArrow(items) {
        const {scrollindexarrow} = this.state;
        let newindex;
        if(scrollindexarrow == '' || scrollindexarrow == 0)
        {
            newindex = items[0].id;
        }else {
            const innerindex = ((items.findIndex(x => x.id == scrollindexarrow) - 2) >= 0) ? (items.findIndex(x => x.id == scrollindexarrow) - 2) : (0)
            newindex = items[innerindex].id
        }
        const screen1 = screenWidth / 2;
        const elementOffset = this.dataSourceCords[newindex];
        if (elementOffset !== undefined && typeof this.scroll.scrollTo == 'function') {
            const x = elementOffset.x - (screen1 - (elementOffset.width / 2));
            this.scroll.scrollTo({
                y: 0,
                x: x,
                animated: true,
            });
            this.setState({scrollindexarrow : newindex});
        }
    }

    render() {
        const {items, upperCase, selectedOpacity, activeBackgroundColor, activeColor, buttonStyle, containerStyle, keyboardShouldPersistTaps, isCurrentChildSelected} = this.props;
        const {index} = this.state;
        console.log('is child selected', isCurrentChildSelected)
        return (
            <View style={[
                styles.scrollArea,
                containerStyle,
            ]}>
            <TouchableOpacity style={styles.touchableFlex} onPress={() => this.leftArrow(items)}>
            <IconML name="ic_angle_left" size={16} color="#000" />
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
                                    (index === route.id && activeBackgroundColor && !isCurrentChildSelected ? {backgroundColor: activeBackgroundColor}:false ),
                                ]}
                                key={(route.id ? route.id : i).toString()}
                                onPress={() => this.setState({index: route.id}, () => setTimeout(() => {
                                        this._scrollTo();
                                        return this.props.onPress(route);
                                    }, 0),
                                )}
                                onLayout={(event) => {
                                    const layout = event.nativeEvent.layout;
                                    if(layout){
                                        this.dataSourceCords[route.id] = layout;
                                         this.setState({dataSourceCords2: this.dataSourceCords}, () => setTimeout(() => {
                                                 this._scrollTo();
                                        }, 0),)
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
            <TouchableOpacity style={styles.touchableFlex} onPress={() => this.rightArrow(items)}>
                <IconML name="ic_angle_right" size={16} color="#000" />
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
    isCurrentChildSelected: PropTypes.bool,
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
        console.log("pressed");
    },
    selectedOpacity: 0.7,
    containerStyle: {},
    keyboardShouldPersistTaps: 'always',
};
