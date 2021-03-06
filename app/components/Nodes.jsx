import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import NodeSelection from './NodeSelection'
import Node from './Node'
import FloatingEditor from '../util/floatingEditor'
import { getSelection } from '../util/selection'

export function Nodes({ nodes, editedNodeId, draggedNodeId, selectedNodeIds, highlightedNodeIds }) {
  let unselectedNodeIds = Object.keys(nodes).filter(id => !selectedNodeIds.includes(id))

  if (unselectedNodeIds.includes(draggedNodeId)) {
    // reorder so that dragged node is painted first
    let nonDraggedNodeIds = unselectedNodeIds.filter(id => id !== draggedNodeId)
    unselectedNodeIds = nonDraggedNodeIds.concat([draggedNodeId])
  }
  
  return (
    <g className="nodes">
      { unselectedNodeIds.map(id => (
        <Node 
          key={id} 
          id={id} 
          currentlyEdited={id === editedNodeId} 
          selected={false}
          highlighted={highlightedNodeIds.includes(id)} />
      )) }

      { selectedNodeIds.length > 0 && 
        <NodeSelection nodeIds={selectedNodeIds}>
          { selectedNodeIds.map(id => (
            <Node 
              key={id} 
              id={id} 
              currentlyEdited={id === editedNodeId} 
              selected={true}
              highlighted={highlightedNodeIds.includes(id)} />
          )) }
        </NodeSelection>
      }
    </g>
  )
}

Nodes.propTypes = {
  nodes: PropTypes.object.isRequired,
  editedNodeId: PropTypes.string,
  draggedNodeId: PropTypes.string,
  selectedNodeIds: PropTypes.array.isRequired,
  highlightedNodeIds: PropTypes.array.isRequired
}

const mapStateToProps = state => {
  const storyMode = state.display.modes.story
  const { list, currentIndex } = state.annotations

  return {
    nodes: state.graph.nodes,
    editedNodeId: FloatingEditor.getId(state.display, 'node'),
    draggedNodeId: state.display.draggedNode ? state.display.draggedNode.id : null,
    selectedNodeIds: getSelection(state.display, 'node'),
    highlightedNodeIds: storyMode ? (list[currentIndex]?.nodeIds || []) : []
  }
}

export default connect(mapStateToProps)(Nodes)