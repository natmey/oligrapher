import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ActionCreators } from 'redux-undo'
import { IoIosUndo, IoIosRedo } from 'react-icons/io'

export default function UndoRedo() {
  const dispatch = useDispatch()
  const past = useSelector(state => state.graph.past)
  const future = useSelector(state => state.graph.future)

  const undo = useCallback(() => dispatch(ActionCreators.undo()), [dispatch])
  const redo = useCallback(() => dispatch(ActionCreators.redo()), [dispatch])

  if (!past || !future) {
    return null
  }

  return (
    <div id="oligrapher-undo-redo">
      <button 
        title="Undo" 
        disabled={past.length === 0}
        onClick={undo}>
        <IoIosUndo />
      </button>
      <button 
        title="Redo" 
        disabled={future.length === 0}
        onClick={redo}>
        <IoIosRedo />
      </button>
    </div>
  )
}