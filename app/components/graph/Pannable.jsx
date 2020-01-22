import React from 'react'
import PropTypes from 'prop-types'
import Draggable from 'react-draggable'

/*
  Allows for the maps to be panned
*/
export default function Pannable(props) {
  const scale = props.zoom * props.actualZoom

  return <Draggable handle='.drag-handle' scale={scale}>
           <g>
             <rect className="drag-handle" x="-5000" y="-5000" width="10000" height="10000" fill="#fff" />
             {props.children}
           </g>
         </Draggable>
}

Pannable.propTypes = {
  children:    PropTypes.node.isRequired,
  zoom:        PropTypes.number.isRequired,
  actualZoom:  PropTypes.number
}

Pannable.defaultProps = {
  actualZoom: 1
}
