import React from 'react'

import Style from '../Style'
import View from '../View'
import Button from '../Button'

export default class ToastView extends React.Component {

  static defaultProps = {
    options: [],
    onChange: () => { },
    renderCancel: true,
  }

  render() {
    const { options = [], renderCancel } = this.props

    return (
      <View style={styles.container}>
        {
          options instanceof Array && options.map((item, index) => (
            <Button
              key={index}
              onPress={this.handlePress.bind(this, item)}
              size={50}
              style={styles.btn}
              fontSize={18}
              activeType="highlight"
              type="simple"
            >{item.label}</Button>
          ))
        }
        {
          renderCancel
            ? (
              <React.Fragment>
                <View style={styles.divider} />
                <Button
                  size={50}
                  fontSize={18}
                  activeType="highlight"
                  type="simple"
                  theme="#333"
                  onPress={this.handlePress.bind(this, { value: 'cancel' })}
                >取消</Button>
              </React.Fragment>
            )
            : null
        }
      </View>
    )
  }

  handlePress = (item) => {
    const { onChange } = this.props
    typeof onChange === 'function' && onChange(item.value, item)
  }
}

const styles = Style.create({
  container: {
    backgroundColor: '#fff',
  },
  divider: {
    height: 6,
    backgroundColor: '#f5f5f5',
  },
  btn: {
    borderBottomWidth: 1,
    borderColor: '#f5f5f5',
  },
})