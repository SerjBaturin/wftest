import React, { useState } from 'react'

import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { ArrowLeft, ArrowDropUp } from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
  bucket: {
    display: 'flex',
    flexDirection: 'column',
    margin: theme.spacing(3),
    padding: theme.spacing(2),
    width: '250px',
    height: '80vh',
    maxHeight: '100%',
    backgroundColor: theme.palette.gray.dark,
    textTransform: 'uppercase',
    color: theme.palette.white.main,
  },
  closed: {
    width: '40px',
    cursor: 'pointer',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '14px',
    fontWeight: '500',
    letterSpacing: '0px',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
  },
  closedTitle: {
    marginTop: theme.spacing(2),
    transform: 'rotate(90deg)',
  },
  arrow: {
    margin: '0',
    padding: '0',
    fontSize: '28px',
  },
  arrowClosed: {
    order: '-1',
  },
}))

const Bucket = ({ title }) => {
  const classes = useStyles()

  const [open, setOpen] = useState(true)

  const handleClick = () => {
    open ? setOpen(false) : setOpen(true)
  }

  // Arrows in Title
  const left = <ArrowLeft className={classes.arrow} />
  const up = (
    <ArrowDropUp className={`${classes.arrow} ${classes.arrowClosed}`} />
  )

  return (
    <div
      className={`${classes.bucket} ${!open ? classes.closed : null}`}
      onClick={!open ? handleClick : null}
    >
      <Typography
        variant="h6"
        className={`${classes.title} ${!open ? classes.closedTitle : null}`}
        onClick={handleClick}
      >
        {title}
        {open ? left : up}
      </Typography>
    </div>
  )
}

export default Bucket
