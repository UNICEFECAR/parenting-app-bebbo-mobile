import React, { Component } from 'react';
import { StyleSheet, View, Image, ActivityIndicator } from 'react-native';

export default class LoadableImage extends Component<any,any> {
  state = {
    loading: true,
    noImage:false
  }

  render() {
    const { url,style } = this.props
    console.log(url,"..url..")
    return (
      <View style={styles.container}>
         <Image
          style={style}
          onLoadEnd={this._onLoadEnd}
          onError={this._onLoadError}
          //onError={(e) => { this.props.source = { uri: 'https://example.domain.com/no-photo.png'}}}
          source={{ uri: url }}
        />
        <ActivityIndicator
        size="large"
        color="red"
          style={styles.activityIndicator}
          animating={this.state.loading}
        />
       </View>
    )
  }

  _onLoadEnd = () => {
    console.log("loading false");
    this.setState({
      loading: false
    })
  }
  _onLoadError = () => {
    console.log("errr");
      this.setState({
        noImage:true,
        loading: false
      })
    
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  activityIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  }
})