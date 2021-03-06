import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { 
  Button, Dialog, DialogActions, DialogContent, DialogContentText 
} from '@material-ui/core'

import { useSelector } from '../util/helpers'

export default function Lock() {
  const dispatch = useDispatch()
  const closeEditor = useCallback(
    () => dispatch({ type: 'SET_EDITOR_MODE', enabled: false }), 
    [dispatch]
  )

  const { userHasLock, name } = useSelector(state => state.attributes.lock)

  return (
    <Dialog
      open={!userHasLock}
      onClose={closeEditor}
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <strong>{name}</strong> is editing this map right now.
          Get in touch with your team to get editing control.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeEditor} variant="contained" color="default">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
