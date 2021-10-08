import React from 'react';
import {
  Animated,
  Dimensions,
  Text,
  View,
  ViewStyle
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('screen');
const { height } = Dimensions.get('screen');
console.log(width, "ScreenWidth")
type Props = {
  /**
   * Container style
   */
  style: ViewStyle;

  /**
   * Component's width
   */
  width: number;

  /**
   * Component's height
   */
  height: number;

  /**
   * Vertical mode
   */
  vertical: boolean;

  /**
   * Minimum value of the ruler
   */
  minimum: number;

  /**
   * Maximum value of the ruler
   */
  maximum: number;

  /**
   * Each segment's width
   */
  segmentWidth: number;

  /**
   * Each segment's space
   */
  segmentSpacing: number;

  /**
   * Color of indicator
   */
  indicatorColor: string;

  /**
   * Indicator's width
   */
  indicatorWidth: number;

  /**
   * Indicator's height
   */
  indicatorHeight: number;

  /**
   * Indicator's space from bottom
   */
  indicatorBottom: number;

  /**
   * Step
   */
  step: number;
  stepPreFix: number;

  /**
   * Steps color
   */
  stepColor: string;

  /**
   * Steps height
   */
  stepHeight: number;

  /**
   * Normal lines color
   */
  normalColor: string;

  /**
   * Normal lines height
   */
  normalHeight: number;

  /**
   * Background color
   */
  backgroundColor: string;

  /**
   * On value change
   */
  onChangeValue: Function;
  initialValue: number
};
interface State {
  value: number;
  scrollX: {
    addListener: Function;
    removeListener: Function;
  };
  scrollValue: number;
}

class Ruler extends React.Component<Props, State> {
  scrollViewRef: React.RefObject<any>;
  // textInputRef: React.RefObject<any>;
  rulerWidth: number;
  scrollListener: any;
  snapSegment: number;
  spacerWidth: number;
  static defaultProps: Props;
  constructor(props: Props) {
    super(props);

    this.state = {
      scrollX: new Animated.Value(0),
      value: 0,
      scrollValue: 0,
    };

    // References
    this.scrollViewRef = React.createRef<any>();
    // this.textInputRef = React.createRef<any>();

    // Calculations
    this.snapSegment = props.segmentWidth + props.segmentSpacing;
    this.spacerWidth = (props.width - props.segmentWidth) / 2;
    this.rulerWidth =
      props.width +
      (props.maximum - props.minimum) * this.snapSegment;
    console.log(this.rulerWidth, "rulerWidth");
    // console.log(props.segmentWidth, "segmentWidth");
    // console.log(props.segmentSpacing, "segmentSpacing");
    // console.log(this.snapSegment, "snapSegment");
    // console.log(props, "props")
  }
  // static getDerivedStateFromProps(props, state) {
  //   console.log(props,state)
  //   if(props.initialValue!=state.value){
  //     return {
  //       value: props.initialValue,
  //       scrollX: (props.initialValue - props.minimum) * props.snapSegment,
  //     };
  //   }
  //   else return null;
  // }
  // UNSAFE_componentWillReceiveProps(nextProps){
  //   console.log(nextProps.initialValue)
  //   if(nextProps.initialValue!=this.state.value){
  //     this.setState({value:nextProps.initialValue})
  //   }

  // }
  // shouldComponentUpdate(nextProps, nextState){
  //   // console.log(nextProps,"nextProps")
  //   // console.log(nextState,"nextState")

  //   if(nextProps.initialValue != nextState.value)
  //   {
  //     // if (this.scrollViewRef && this.scrollViewRef.current) {
  //       this.scrollViewRef.current?.scrollTo({
  //         x: (nextProps.initialValue - nextProps.minimum) * this.snapSegment,
  //         y: 0,
  //         animated: true
  //       });

  //       nextProps.onChangeValue(nextProps.initialValue)
  //     // }
  //     this.setState({value:nextProps.initialValue})
  //     return false
  //   } else{
  //     return false
  //   }
  // }

  componentDidMount() {
    const { minimum, initialValue, onChangeValue } = this.props;
    console.log(initialValue,"initialValue");
    if (this.scrollViewRef && this.scrollViewRef.current) {
     setTimeout(() => {
      this.scrollViewRef.current?.scrollTo({
        x: (initialValue - minimum) * this.snapSegment,
        y: 0,
        animated: true
      });
     });
     
      this.setState({
        value: initialValue,
      });
      onChangeValue(initialValue)
    }

    // Create a listener
    this.scrollListener = this.state.scrollX.addListener(({ value }) => {
      console.log(value, "fromScroll", this.snapSegment, minimum,Math.round(value / this.snapSegment) + minimum);
      this.setState({
        value: Math.round(value / this.snapSegment) + minimum,
        scrollValue: value,
      });
      onChangeValue(Math.round(value / this.snapSegment) + minimum)
     
      // }
    });
  }
  // moveTo() {
  //   const prevValue = this.state.scrollValue;
  //   const newValue = this.state.value*this.snapSegment*(Math.round(this.state.value / this.snapSegment) + this.props.minimum);
  //   console.log(prevValue, newValue,"fromMoveTo");
  // //  console.log(this.state.value*this.snapSegment*(Math.round(this.state.value / this.snapSegment) + this.props.minimum), "moveTo");
  //   if(prevValue<newValue){
    
  //     setTimeout(() => {
  //       console.log('in if moveto');
  //     this.scrollViewRef.current.scrollTo({ x: newValue, y: 0, animated: false });
  //     });
  //     // this.scrollViewRef.current?.scrollTo({
  //     //   x: (this.state.value*this.snapSegment*(Math.round(this.state.value / this.snapSegment) + this.props.minimum)),
  //     //   y: 0,
  //     // });
  //   }
  // }

  componentWillUnmount() {
    // Remove the above listener
    if (this.scrollListener) {
      this.state.scrollX.removeListener(this.scrollListener);
    }

  }

  renderRuler(data: number[]) {
    const {
      minimum,
      maximum,
      segmentWidth,
      segmentSpacing,
      step,
      stepPreFix,
      stepColor,
      stepHeight,
      normalColor,
      normalHeight,
    } = this.props;

    // Create an array to make a ruler

    // console.log(minimum,maximum,data);
    return (
      <View
        style={{
          width: this.rulerWidth,
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'flex-end',
        }}>
        {/* Spacer */}
        <View
          style={{
            width: this.spacerWidth,
          }}
        />

        {/* Ruler */}
        {data.map((i, index) => {
          return (

            <View
              key={index}
              style={{ flexDirection: 'column-reverse' }}>
              <View
                style={{
                  backgroundColor: i % step === 0 ? stepColor : normalColor,
                  height: i % step === 0 ? stepHeight : normalHeight,
                  width: segmentWidth,
                  marginRight: segmentSpacing,
                }}
              />
              {i % step === Number(0.0) ? (
                <View style={{ width: 40, marginLeft: -25 }}>
                  <Text style={{ textAlign: 'center', fontSize: 11 }}>
                    {Number(stepPreFix * i).toFixed(2)}
                  </Text>
                </View>
              ) : null}
            </View>
          );
        })}

        {/* Spacer */}
        <View
          style={{
            width: this.spacerWidth,
          }}
        />
      </View>
    );
  }

  render() {
    const {
      style,
      minimum,
      maximum,
      segmentWidth,
      indicatorWidth,
      indicatorHeight,
      indicatorColor,
      indicatorBottom,
      backgroundColor,
      width,
      height,
      vertical,
      onChangeValue,
    } = this.props;
    const data = [...Array(maximum - minimum + 1).keys()].map(
      (i) => i + minimum,
    );
    return (
      <SafeAreaView
        style={[
          style,
          {
            width,
            height,
            backgroundColor,
            position: 'relative',
            transform: vertical ? [{ rotate: '90deg' }] : undefined,
          },
        ]}>
        {/* Number && Unit */}
        <View
          style={{
            width: indicatorWidth,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            bottom: indicatorBottom,
            left: (width - indicatorWidth) / 2,
          }}
          pointerEvents="none">

          {/* Indicator */}
          <View style={{ flexDirection: 'row' }}>
            <View
              style={{
                height: indicatorHeight,
                // transform: [{ rotate: '180deg' }],
                backgroundColor: indicatorColor,
                width: segmentWidth,
              }}>
              <View
                style={{
                  marginTop: 0,
                  marginLeft: -14,
                  borderLeftWidth: 15,
                  borderRightWidth: 15,
                  borderTopWidth: 20,
                  borderLeftColor: 'transparent',
                  borderRightColor: 'transparent',
                  borderTopColor: indicatorColor,
                }}></View>
            </View>
          </View>
        </View>
        <Animated.ScrollView
          ref={this.scrollViewRef}
          horizontal
          contentContainerStyle={{
            justifyContent: 'flex-end',
          }}
          scrollToOverflowEnabled={true}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          snapToInterval={Math.round(this.snapSegment)}
          onScroll={
            // (event) => {
            //   console.log(event.nativeEvent.contentOffset, "onScroll");
            Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: { x: this.state.scrollX },
                  },
                },
              ],
              { useNativeDriver: false },
            )
          }
          // }
          // onScrollEndDrag={() => {

          // }}
          onMomentumScrollEnd={() => {
            this.scrollViewRef.current?.scrollTo({
              x: (this.state.value * this.snapSegment)+ minimum,
              y: 0,
            });
            // console.log(this.state.value,  "onMomentumScrollEnd");
            // console.log(this.state.scrollX, "onMomentumScrollEnd");
            // onChangeValue(this.state.value);
            // x: (initialValue - minimum) * this.snapSegment,
            // this.scrollViewRef.current?.scrollTo({
            //   x: (this.state.value * this.snapSegment)+ minimum,
            //   y: 0,
            // });
            // const new1 = this.state.value;
            // const new2 =this.snapSegment*(Math.round(this.state.value / this.snapSegment) + minimum);
            // const new3 = (this.state.value * this.snapSegment)+ minimum;
            // console.log(new1,new2,new3,"vals",this.state.scrollValue);
            // this.moveTo();
// console.log((this.state.value * this.snapSegment)+ minimum,this.state.value,"onMomentumScrollEnd",this.snapSegment*(Math.round(this.state.value / this.snapSegment) + minimum));
// console.log(this.state.value*(this.snapSegment*(Math.round(this.state.value / this.snapSegment) + minimum)),"multiplied")
            // if((this.state.scrollValue)<this.state.value*this.snapSegment*(Math.round(this.state.value / this.snapSegment) + minimum)){
            //   this.scrollViewRef.current?.scrollTo({
            //     x: this.state.value*this.snapSegment*(Math.round(this.state.value / this.snapSegment) + minimum),
            //     y: 0,
            //   });
            // }
      //       console.log((this.state.value * this.snapSegment)+ minimum);
      //       console.log(this.snapSegment * Math.round(this.state.value / this.snapSegment) + minimum)
      // console.log(this.state.value, "fromScroll1", this.snapSegment, minimum,Math.round(this.state.value / this.snapSegment) + minimum);

            // if((this.state.value * this.snapSegment)+ minimum<this.state.value)
            // {
            //   this.scrollViewRef.current?.scrollTo({
            //     x: this.snapSegment * Math.round(this.state.value / this.snapSegment) + minimum,
            //     y: 0,
            //   });
            // }
      // console.log(value, "fromScroll", this.snapSegment, minimum,Math.round(value / this.snapSegment) + minimum);

          }}>
          {this.renderRuler(data)}
        </Animated.ScrollView>
      </SafeAreaView >
    );
  }
}
Ruler.defaultProps = {
  style: {},
  vertical: false,
  width,
  height: height * 0.23,
  onChangeValue: () => { },
  minimum: 0,
  maximum: 100,
  segmentWidth: 2,
  segmentSpacing: 20,
  indicatorColor: '#FF0000',
  indicatorWidth: 100,
  indicatorHeight: 80,
  indicatorBottom: 20,
  step: 10,
  stepPreFix: 0,
  stepColor: '#333333',
  stepHeight: 40,
  normalColor: '#999999',
  normalHeight: 20,
  backgroundColor: '#FFFFFF',
  initialValue: 0,
};

export default Ruler;
