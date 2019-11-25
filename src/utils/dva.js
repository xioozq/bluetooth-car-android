import React from 'react'
import { Provider } from 'react-redux'
import { create } from 'dva-core'
import createLoading from 'dva-loading'


export default function (options) {

  const app = create(options)
  app.use(createLoading())

  // HMR workaround
  if (!global.__dvaRegistered) options.models.forEach(model => app.model(model))
  global.__dvaRegistered = true

  app.start()

  const store = app._store

  app.start = container => () => <Provider store={store}>{container}</Provider>
  app.getStore = () => store

  return app
}