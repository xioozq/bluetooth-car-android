import React from 'react'
import configStyle from '~/style/config'
import { View, Text, Style, ScrollView, StatusBar, Image, Touch, Button, ParallaxView, NavBar, PlaceHolder } from '~/components'

const checkedImg = require('~/assets/image/icon_checked.png')

export default class SelectPage extends React.Component {

  static defaultProps = {
    minimize: false,
    labelKey: 'label',
    valueKey: 'value',
    list: [],
    status: null,
    title: '请选择',
    cancelText: '取消',
    submitText: '确定',
    onSubmit: null,
    onCancel: null,
    onRetry: null,
    selectedValue: null,
  }

  state = {
    selectedIndex: null,
    selectedItem: null,
  }

  render() {
    const { selectedIndex } = this.state
    const { list, cancelText, submitText, minimize, status, onRetry, labelKey } = this.props

    let parallaxProps = {
      style: styles.container,
      contentContainerStyle: status ? { flex: 1, alignItems: 'center', paddingTop: 100 } : null,
      parallaxHeaderHeight: 120,
      renderStickyHeader: this.renderHeader,
      renderForeground: this.renderForeground,
    }

    if (minimize) {
      parallaxProps.parallaxHeaderHeight = configStyle.size.navBarHeight
      parallaxProps.renderFixedHeader = this.renderForeground
      delete parallaxProps.renderStickyHeader
      delete parallaxProps.renderForeground
    }

    const listElement = (
      <React.Fragment>
        <PlaceHolder status={status} onRetry={onRetry} />
        {
          !status && list instanceof Array && list.map((item, index) => (
            <Touch key={index} style={[styles.item, minimize ? styles.minimizeItem : null, index === selectedIndex ? styles.selectedItem : null]} type="highlight" onPress={this.handleSelect.bind(this, item, index)}>
              <View style={styles.itemTextWrapper}>
                <Text style={[styles.itemTitle, index === selectedIndex ? styles.selectedItemText : null]}>{item[labelKey]}</Text>
                {item.desc && !minimize ? <Text style={styles.itemDesc}>{item.desc}</Text> : null}
              </View>
              {
                index === selectedIndex
                  ? <Image source={checkedImg} style={styles.checkIcon} />
                  : <View style={styles.checkIcon} />
              }
            </Touch>
          ))
        }
      </React.Fragment>
    )

    return (
      <View style={styles.container}>
        {
          minimize
            ? (
              <React.Fragment>
                {this.renderForeground()}
                <ScrollView style={styles.container}>
                  {listElement}
                </ScrollView>
              </React.Fragment>
            )
            : (
              <ParallaxView {...parallaxProps}>
                {listElement}
              </ParallaxView>
            )
        }
        <View style={styles.btnBar}>
          <Button onPress={this.handleCancel} textStyle={styles.btnText} style={[styles.btn, styles.btnCancel]} theme="#333" highlight={false} activeType="highlight">{cancelText}</Button>
          <Button onPress={this.handleSubmit} textStyle={styles.btnText} disabled={typeof selectedIndex !== 'number'} style={[styles.btn, styles.btnSubmit]}>{submitText}</Button>
        </View>
      </View>
    )
  }

  renderHeader = () => {
    const { title } = this.props

    return (<NavBar title={title} />)
  }

  renderForeground = () => {
    const { title, minimize } = this.props

    return (
      <View style={styles.headerWrapper}>
        <StatusBar height={0} />
        <View style={[styles.header, minimize ? styles.minimizeHeader : null]}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>
    )
  }

  componentDidMount() {
    this.handleInitial()
  }

  componentWillReceiveProps(nextProps) {
    this.handleInitial(nextProps)
  }

  handleInitial = (props) => {
    const _props = props || this.props
    const { selectedValue, list, valueKey } = _props
    const { selectedIndex } = this.state

    if (selectedValue && list instanceof Array) {
      let index = null
      for (let i = 0; i < list.length; i++) {
        if (list[i][valueKey] === selectedValue) {
          index = i
        }
      }
      if (typeof index === 'number' && typeof selectedIndex !== 'number') {
        // 找到符合的选项， 并且内部state还没有发生过选择， 就更新
        this.setState({
          selectedIndex: index,
          selectedItem: list[index],
        })
      }
    }
  }

  handleSelect = (item, index) => {
    this.setState({
      selectedIndex: index,
      selectedItem: item,
    })
  }

  handleSubmit = () => {
    const { onSubmit } = this.props
    const { selectedItem } = this.state
    typeof onSubmit === 'function' && onSubmit(selectedItem)
  }

  handleCancel = () => {
    const { onCancel } = this.props
    typeof onCancel === 'function' && onCancel()
  }

}

const styles = Style.create({
  container: {
    flex: 1,
  },
  headerWrapper: {
    backgroundColor: '#fff',
  },
  header: {
    height: 120,
    paddingHorizontal: 30,
    paddingTop: 40,
    justifyContent: 'center',
  },
  title: {
    color: '#333',
    fontSize: 24,
    lineHeight: 33,
  },
  minimizeHeader: {
    height: 80,
    paddingTop: 4,
  },
  item: {
    width: '100%',
    height: 90,
    flexDirection: 'row',
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  minimizeItem: {
    height: 60,
  },
  selectedItem: {
    backgroundColor: configStyle.color.background,
  },
  selectedItemText: {
    fontWeight: '500',
  },
  itemTextWrapper: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  itemTitle: {
    flex: 0,
    color: '#333',
    fontSize: 18,
  },
  itemDesc: {
    flex: 1,
    marginLeft: 20,
    color: '#888',
    fontSize: 12,
  },
  checkIcon: {
    width: 24,
    height: 24,
    marginLeft: 20,
  },
  btnBar: {
    height: 60,
    flexDirection: 'row',
  },
  btn: {
    flex: 1,
    borderRadius: 0,
  },
  btnText: {
    fontSize: 16,
  },
  btnSubmit: {},
  btnCancel: {
    backgroundColor: '#fff',
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderColor: configStyle.color.border,
  },
})