import React from 'react';
import {
  Animated,
  Dimensions,
  SafeAreaView,
  Text,
  View,
  ViewStyle
} from 'react-native';

const {width} = Dimensions.get('screen');
const {height} = Dimensions.get('screen');

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
  initialValue:number
};
interface State {
  value: number;
  scrollX: {
    addListener: Function;
    removeListener: Function;
  };
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
    };

    // References
    this.scrollViewRef = React.createRef<any>();
    // this.textInputRef = React.createRef<any>();

    // Calculations
    this.snapSegment = props.segmentWidth + props.segmentSpacing;
    this.spacerWidth = (props.width - props.segmentWidth) / 2;
    this.rulerWidth =
      props.width -
      props.segmentWidth +
      (props.maximum - props.minimum) * this.snapSegment;
  }

  componentDidMount() {
    const {minimum,initialValue,onChangeValue} = this.props;
  
      if (this.scrollViewRef && this.scrollViewRef.current) {
        this.scrollViewRef.current?.scrollTo({
          x: (initialValue - minimum) * this.snapSegment,
          y: 0,
          animated: true
        });
        this.setState({
          value: initialValue,
        });
        onChangeValue(initialValue)
      }
  
    // Create a listener
    this.scrollListener = this.state.scrollX.addListener(({value}) => {
      this.setState({
        value: Math.round(value / this.snapSegment) + minimum,
      });
      // }
    });
  }

  componentWillUnmount() {
    // Remove the above listener
    this.state.scrollX.removeListener(this.scrollListener);
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
                style={{flexDirection: 'column-reverse'}}>
                <View
                  style={{
                    backgroundColor: i % step === 0 ? stepColor : normalColor,
                    height: i % step === 0 ? stepHeight : normalHeight,
                    width: segmentWidth,
                    marginRight: segmentSpacing,
                  }}
                />
                {i % step === Number(0.0) ? (
                  <View style={{width: 40, marginLeft: -25}}>
                    <Text style={{textAlign: 'center', fontSize: 11}}>
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
            transform: vertical ? [{rotate: '90deg'}] : undefined,
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
          <View style={{flexDirection: 'row'}}>
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
          bounces={false}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          snapToInterval={this.snapSegment}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {x: this.state.scrollX},
                },
              },
            ],
            {useNativeDriver: true},
          )}
          onMomentumScrollEnd={() => onChangeValue(this.state.value)}>
          {this.renderRuler(data)}
        </Animated.ScrollView>
      </SafeAreaView>
    );
  }
}
Ruler.defaultProps = {
  style: {},
  vertical: false,
  width,
  height: height * 0.23,
  onChangeValue: () => {},
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
  initialValue:0,
};

export default Ruler;
