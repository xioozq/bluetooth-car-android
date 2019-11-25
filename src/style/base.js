import configStyle from './config'

const page = {
  flex: 1,
  backgroundColor: configStyle.color.background,
}

export default {
  page: {
    ...page,
  },
  safePage: {
    ...page,
    paddingBottom: configStyle.size.pageSafeBottom,
  },
  cover: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    left: 0,
    top: 0,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  link: {
    color: configStyle.color.primary,
    textDecorationLine: 'underline',
  },
  titleBarFloat: {
    backgroundColor: 'transparent',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
}