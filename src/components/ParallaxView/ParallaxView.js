import React from 'react'
import ParallaxScrollView from 'react-native-parallax-scroll-view'
import configStyle from '~/style/config'
import View from '../View'
import Image from '../Image'

export default class ParallaxView extends React.Component {

  static defaultProps = {
    contentBackgroundColor: '#fff',
    backgroundColor: '#fff',
    stickyHeaderHeight: configStyle.size.navBarHeight,
    parallaxHeaderHeight: 300,
    backgroundScrollSpeed: 10,
    backgroundImage: null,
    backgroundImageProps: {},
    renderBackground: null,
    renderCustomBackground: null,
    renderForeground: null,
    renderStickyHeader: null,
    renderFixedHeader: null,
    style: null,
  }

  render() {
    const {
      contentBackgroundColor,
      backgroundColor,
      stickyHeaderHeight,
      parallaxHeaderHeight,
      backgroundScrollSpeed,
      children,
      renderForeground,
      renderStickyHeader,
      renderFixedHeader,
      style,
      ...extraProps
    } = this.props

    return (
      <ParallaxScrollView
        {...extraProps}
        style={style}
        contentBackgroundColor={contentBackgroundColor}
        backgroundColor={backgroundColor}
        stickyHeaderHeight={stickyHeaderHeight}
        parallaxHeaderHeight={parallaxHeaderHeight}
        backgroundScrollSpeed={backgroundScrollSpeed}
        renderBackground={this.renderBackground}
        renderForeground={renderForeground}
        renderStickyHeader={renderStickyHeader}
        renderFixedHeader={renderFixedHeader}
      >
        {children}
      </ParallaxScrollView>
    )
  }

  renderBackground = () => {
    const { renderCustomBackground, renderBackground, backgroundImage, backgroundImageProps } = this.props

    return (
      typeof renderCustomBackground === 'function'
        ? renderCustomBackground()
        : (
          <View>
            {
              backgroundImage
                ? <Image source={backgroundImage} {...backgroundImageProps} />
                : null
            }

            {
              typeof renderBackground === 'function'
                ? renderBackground()
                : null
            }
          </View>
        )

    )
  }

}
