import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { AppBar, Button } from '@material-ui/core'

import FilterBtnList from './FilterBtnList'
import SwitcherList from './SwitcherList'
import MenuButton from './MenuButton'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    position: 'fixed',
    top: '0',
    flexDirection: 'row',
    alignItems: 'center',
    height: theme.spacing(5) - 15,
    backgroundColor: theme.palette.gray.header,
  },
  label: {
    margin: theme.spacing(0),
    padding: '0 25px',
    height: '100%',
    backgroundColor: theme.palette.gray.label,
    borderRadius: 0,
    borderBottom: '3px solid',
    letterSpacing: '1px',
    cursor: 'default',
  },
}))

const Header = () => {
  const classes = useStyles()

  return (
    <AppBar className={classes.root} position="static">
      <Button color="primary" className={classes.label}>
        WORKFLOW
      </Button>
      <MenuButton />
      <FilterBtnList />
      <SwitcherList />
    </AppBar>
  )
}

export default Header
