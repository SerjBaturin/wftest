import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

import Switcher from './Switcher'

const useStyles = makeStyles((theme) => ({
  btnGroup: {
    display: 'flex',
    marginLeft: 'auto',
  },
}))

const SwitcherList = () => {
  const classes = useStyles()

  return (
    <>
      <div className={classes.btnGroup}>
        <Switcher label="INSHOP" />
        <Switcher label="second" />
        <Switcher label="three" />
        <Switcher label="four" />
        <Switcher label="five" />
      </div>
    </>
  )
}

export default SwitcherList
