import React from 'react'
import { Image as RNImage } from 'react-native'

export default class Image extends React.Component {

  static defaultProps = {
    source: null,
    headers: {},
    cache: 'default',
    resizeMode: 'cover',
    onLoadStart: null,
    onProgress: null,
    onLoad: null,
    onError: null,
    onLoadEnd: null,
    style: null,
  }

  render() {

    const {
      source,
      headers,
      cache,
      resizeMode,
      onLoadStart,
      onProgress,
      onLoad,
      onError,
      onLoadEnd,
      style,
      ...extraProps
    } = this.props

    let _source = null

    if (typeof source === 'string') {
      _source = {
        uri: source,
        headers,
        cache,
      }
    } else {
      _source = source
    }


    return (
      <RNImage
        {...extraProps}
        style={style}
        source={_source}
        resizeMode={resizeMode}
        onLoadStart={onLoadStart}
        onProgress={onProgress}
        onLoad={onLoad}
        onError={onError}
        onLoadEnd={onLoadEnd}
      />
    )
  }

}

