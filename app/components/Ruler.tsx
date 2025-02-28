import { bgcolortransparent } from "../instances/bebbo/styles/style";
import React from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { convertDigits } from "../services/Utils";

const { width } = Dimensions.get("screen");
const { height } = Dimensions.get("screen");
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
  initialValue: number;
  locale: any;
};
interface State {
  value: number;
  scrollX: {
    addListener: Function;
    removeListener: Function;
  };
  scrollValue: number;
}
export const styles = StyleSheet.create({
  flexEndScrollView: { justifyContent: "flex-end" },
  indicatorOuterView: { flexDirection: "row" },
  indicatorViewSet: {
    borderLeftColor: bgcolortransparent,
    borderLeftWidth: 15,
    borderRightColor: bgcolortransparent,
    borderRightWidth: 15,
    borderTopWidth: 20,
    marginLeft: -14,
    marginTop: 0,
  },
  mainViewOuter: {
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  numberView: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
  },
  renderOuterView: { position: "relative" },
  rulerView: { flexDirection: "column-reverse" },
  textOuterView: { marginLeft: -25, width: 40 },
  textView: { fontSize: 11, textAlign: "center" },
});
class Ruler extends React.Component<Props, State> {
  scrollViewRef: React.RefObject<any>;
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
    // Calculations
    this.snapSegment = props.segmentWidth + props.segmentSpacing;
    this.spacerWidth = (props.width - props.segmentWidth) / 2;
    this.rulerWidth =
      props.width + (props.maximum - props.minimum) * this.snapSegment;
  }

  componentDidMount(): any {
    const { minimum, initialValue, onChangeValue } = this.props;
    if (this.scrollViewRef && this.scrollViewRef.current) {
      setTimeout(() => {
        this.scrollViewRef.current?.scrollTo({
          x: (initialValue - minimum) * this.snapSegment,
          y: 0,
          animated: true,
        });
      });
      this.setState({
        value: initialValue,
      });
      onChangeValue(initialValue);
    }

    // Create a listener
    this.scrollListener = this.state.scrollX.addListener(({ value }: any) => {
      this.setState({
        value: Math.round(value / this.snapSegment) + minimum,
        scrollValue: value,
      });
      onChangeValue(Math.round(value / this.snapSegment) + minimum);
    });
  }

  componentWillUnmount(): any {
    // Remove the above listener
    if (this.scrollListener) {
      this.state.scrollX.removeListener(this.scrollListener);
    }
  }

  renderRuler(data: number[]): any {
    const {
      segmentWidth,
      segmentSpacing,
      step,
      stepPreFix,
      stepColor,
      stepHeight,
      normalColor,
      normalHeight,
      locale,
    } = this.props;

    // Create an array to make a ruler
    return (
      <View
        style={[
          styles.mainViewOuter,
          {
            width: this.rulerWidth,
          },
        ]}
      >
        {/* Spacer */}
        <View
          style={{
            width: this.spacerWidth,
          }}
        />

        {/* Ruler */}
        {data.map((i, index) => {
          return (
            <View key={index} style={styles.rulerView}>
              <View
                style={{
                  backgroundColor: i % step === 0 ? stepColor : normalColor,
                  height: i % step === 0 ? stepHeight : normalHeight,
                  width: segmentWidth,
                  marginRight: segmentSpacing,
                }}
              />
              {i % step === Number(0.0) ? (
                <View style={styles.textOuterView}>
                  <Text style={styles.textView}>
                    {convertDigits(Number(stepPreFix * i).toFixed(2), locale)}
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

  render(): any {
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
    } = this.props;
    const data = [...Array(maximum - minimum + 1).keys()].map(
      (i) => i + minimum
    );
    return (
      <View
        style={[
          style,
          styles.renderOuterView,
          {
            width,
            height,
            backgroundColor,
            transform: vertical ? [{ rotate: "90deg" }] : undefined,
          },
        ]}
      >
        {/* Number && Unit */}
        <View
          style={[
            styles.numberView,
            {
              width: indicatorWidth,
              bottom: indicatorBottom,
              left: (width - indicatorWidth) / 2,
            },
          ]}
          pointerEvents="none"
        >
          {/* Indicator */}
          <View style={styles.indicatorOuterView}>
            <View
              style={{
                height: indicatorHeight,
                backgroundColor: indicatorColor,
                width: segmentWidth,
              }}
            >
              <View
                style={[
                  styles.indicatorViewSet,
                  {
                    borderTopColor: indicatorColor,
                  },
                ]}
              ></View>
            </View>
          </View>
        </View>
        <Animated.ScrollView
          ref={this.scrollViewRef}
          horizontal
          contentContainerStyle={styles.flexEndScrollView}
          scrollToOverflowEnabled={true}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          snapToInterval={Math.round(this.snapSegment)}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: { x: this.state.scrollX },
                },
              },
            ],
            { useNativeDriver: false }
          )}
          onMomentumScrollEnd={(): any => {
            this.scrollViewRef.current?.scrollTo({
              x: this.state.value * this.snapSegment + minimum,
              y: 0,
            });
          }}
        >
          {this.renderRuler(data)}
        </Animated.ScrollView>
      </View>
    );
  }
}
Ruler.defaultProps = {
  style: {},
  vertical: false,
  width,
  height: height * 0.23,
  onChangeValue: (): any => {
    console.log("ruler value change");
  },
  minimum: 0,
  maximum: 100,
  segmentWidth: 2,
  segmentSpacing: 20,
  indicatorColor: "#FF0000",
  indicatorWidth: 100,
  indicatorHeight: 80,
  indicatorBottom: 20,
  step: 10,
  stepPreFix: 0,
  stepColor: "#333333",
  stepHeight: 40,
  normalColor: "#999999",
  normalHeight: 20,
  backgroundColor: "#FFFFFF",
  initialValue: 0,
  locale: "bn",
};

export default Ruler;
