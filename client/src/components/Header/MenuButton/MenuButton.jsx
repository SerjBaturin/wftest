import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import {
  Button,
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  MenuItem,
  MenuList,
} from '@material-ui/core'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'

const useStyles = makeStyles((theme) => ({
  menu: {
    backgroundColor: theme.palette.gray.dark,
    color: theme.palette.white.main,
    minWidth: '320px',
    marginTop: 18,
  },
  menuItem: {
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, .2)',
    },
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

const MenuButton = () => {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef(null)

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }

    setOpen(false)
  }

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault()
      setOpen(false)
    }
  }

  const prevOpen = React.useRef(open)
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus()
    }

    prevOpen.current = open
  }, [open])

  return (
    <div className={classes.root}>
      <div>
        <Button
          className={classes.button}
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          Best BodyShop Ever <ArrowRightIcon /> Tony Stark
        </Button>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <Paper className={classes.menu}>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="menu-list-grow"
                    onKeyDown={handleListKeyDown}
                  >
                    <MenuItem className={classes.menuItem} onClick={handleClose}>Change company</MenuItem>
                    <MenuItem className={classes.menuItem} onClick={handleClose}>Logout</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </div>
  )
}

export default MenuButton