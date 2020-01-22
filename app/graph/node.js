import PropTypes from 'prop-types'
import merge from 'lodash/merge'
import { generate } from 'shortid'

import { stringOrNumber } from '../util/types'

const nodeDefaults = {
  id: null,
  name: null,
  x: null,
  y: null,
  scale: 1,
  status: "normal",
  type: "circle",
  image: null,
  url: null
}

export const nodeShape = {
  id: stringOrNumber.isRequired,
  name: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
  scale: PropTypes.number,
  status: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  image: PropTypes.string,
  url: PropTypes.string
}

export const propTypes = {
  node: PropTypes.shape(nodeShape),
  arrayOfNodes: PropTypes.arrayOf(PropTypes.shape(nodeShape)),
}

export function newNode(attributes = {}) {
  let node = merge({}, nodeDefaults, attributes)

  if (!node.id) {
    node.id = generate()
  }

  return node
}

export default {
  "new": newNode,
  "types" : propTypes
}
