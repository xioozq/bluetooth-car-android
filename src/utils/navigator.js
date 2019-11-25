import { StackActions, NavigationActions } from 'react-navigation'
import { getDeepValue } from './index'

class NavigationService {
  constructor() {
    this._navigator = null
  }

  setNavigator(navigator) {
    this._navigator = navigator
  }

  dispatch(action) {
    this._navigator && this._navigator.dispatch(action)
  }

  getNavStack() {
    return getDeepValue(this._navigator, 'state.nav.routes') || []
  }

  getCurrentPage() {
    const routes = this.getNavStack()
    if (routes instanceof Array && routes.length > 0) {
      const route = routes[routes.length - 1]
      return route.routeName
    }
    return null
  }

  navTo(options = {}) {

    const { route = '', type = 'push', params = {}, __transition } = options

    let key
    // action 类型匹配
    let actionType = ''

    switch (type) {
      case 'reset': {
        const resetAction = StackActions.reset({
          index: 0,
          actions: [{
            ...NavigationActions.navigate({ routeName: route }),
            params: {
              ...params,
              __transition: __transition || 'forHorizontal',
            }
          }],
        })
        this.dispatch(resetAction)
        return
      }
      case 'auto': {
        actionType = NavigationActions.NAVIGATE
        break
      }
      case 'back': {
        actionType = NavigationActions.BACK
        break
      }
      case 'replace': {
        const routes = getDeepValue(this.props, 'route.routes') || []
        const prevKey = getDeepValue(this.props, `route.routes.${Math.max(routes.length - 1, 0)}.key`)
        key = prevKey
        actionType = StackActions.REPLACE
        break
      }
      default: {
        actionType = StackActions.PUSH
      }
    }


    this.dispatch({
      type: actionType,
      routeName: route,
      params: {
        __transition,
        ...params,
      },
      key,
    })
  }

  navBack = () => {
    this.navTo({
      type: 'back',
    })
  }

}

export default new NavigationService()