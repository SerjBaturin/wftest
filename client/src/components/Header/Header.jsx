import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { AppBar, Button } from '@material-ui/core'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'

import FilterBtnList from './FilterBtnList'
import SwitcherList from './SwitcherList'

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
  button: {
    margin: '0 15px',
    padding: '0 25px',
    height: '60%',
    color: theme.palette.white.main,
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, .2)',
    },
  },
}))

const Header = () => {
  const classes = useStyles()

  return (
    <AppBar className={classes.root} position="static">
      <Button color="primary" className={classes.label}>
        WORKFLOW
      </Button>
      <Button className={classes.button}>
        Best BodyShop Ever <ArrowRightIcon /> Tony Stark
      </Button>
      <FilterBtnList />
      <SwitcherList />
    </AppBar>
  )
}

export default Header
