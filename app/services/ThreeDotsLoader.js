import React from 'react'
import { View, StyleSheet, Animated } from 'react-native'
import PropTypes from 'prop-types';
import { primaryColor, chatDotLoaderBGColor } from "@styles/style";

const SIZE = 9
const MARGIN = 3
const BG = chatDotLoaderBGColor
const ACTIVE_BG = primaryColor
const dots = [1, 2, 3]
const INTERVAL = 300
const ANIMATION_DURATION = 400
const ANIMATION_SCALE = 1.4
const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
})
export default class ThreeDotsLoader extends React.Component {
  state = {
    active: 1
  }

  componentDidMount(){
    this.interval = setInterval(() => {
      const active = this.state.active
      this.setState({ active: active > 2 ? 1 : active + 1})
    }, INTERVAL);
  }

  componentWillUnmount(){
    clearInterval(this.interval)
  }

  render() {
  const active = this.state.active
   return (
     <View style={styles.main}>
       {dots.map(i => <Dot key={i} {...this.props} active={i === active}/>)}
     </View>
   )
  }
}

class Dot extends React.Component {
  static defaultProps = {
    size: SIZE,
    background: BG,
    activeBackground: ACTIVE_BG,
    dotMargin: MARGIN,
    animationDuration: ANIMATION_DURATION,
    animationScale: ANIMATION_SCALE,
  }

  constructor(props) {
    super(props)
    this.scale = new Animated.Value(1)
  }

  componentDidMount(){
    if (this.props.active) this.scaleUp()
  }

  componentDidUpdate(prevProps){
    if (prevProps.active && !this.props.active){
      this.scaleDown()
    }
    if (!prevProps.active && this.props.active){
      this.scaleUp()
    }
  }

  scaleDown = () => {
    Animated.timing(
      this.scale,
      {
        toValue: 1,
        duration: this.props.animationDuration,
        useNativeDriver: false
      }
    ).start()
  }

  scaleUp = () => {
    Animated.timing(
      this.scale,
      {
        toValue: this.props.animationScale,
        duration: this.props.animationDuration,
        useNativeDriver: false
      }
    ).start()
  }

  render(){
    const { active, size, background, activeBackground, dotMargin } = this.props
    const style = {
      height: size, 
      width: size,
      borderRadius: size / 2,
      marginHorizontal: dotMargin,
      backgroundColor: active ? activeBackground : background
    }
    return (
      <Animated.View style={[style, {transform: [{ scale: this.scale }]}]}/>
    )
  }
}

Dot.propTypes = {
    active: PropTypes.any,
    size: PropTypes.any,
    background: PropTypes.any,
    activeBackground: PropTypes.any,
    dotMargin: PropTypes.any,
    animationDuration: PropTypes.any,
    animationScale: PropTypes.any,
}