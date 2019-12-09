import { createOligrapherStore, renderNewApplication } from './util/render'
import stateInitalizer from './util/stateInitalizer'

import './oligrapher.scss'

/*
  Main entry point of Oligrapher.

  This is how to initialize a new map on a page:

     const oli = new Oligrapher(<your Configuration>)

     The configuration option accepts five optional keys:
        - settings
        - hooks
        - graph
        - attributes
        - display

  See app/util/defaultState for a list of variables
*/
export default class Oligrapher {
  constructor(userConfig = {}) {

    let initialState = userConfig?.initialState || {}
    initialState.settings = userConfig?.settings || {}
    initialState.hooks = userConfig?.hooks || {}
    initialState.graph = userConfig?.graph || {}
    initialState.attributes = userConfig?.attributes || {}
    initialState.display = userConfig?.display || {}

    this.store = createOligrapherStore(stateInitalizer(initialState))
    renderNewApplication(this.store, this.store.getState().settings.rootElement)
  }
}
