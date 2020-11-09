import React, { useState } from 'react'
import { Draggable } from 'react-beautiful-dnd'

import Case from '../../CaseList/Case'

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
    minHeight: '80vh',
    height: '80vh',
    backgroundColor: theme.palette.gray.dark,
    textTransform: 'uppercase',
    color: theme.palette.white.main,
  },
  caseList: {
    overflowY: 'scroll',
    paddingRight: '5px',
    '&::-webkit-scrollbar': {
      width: '.4em',
    },
    '&::-webkit-scrollbar-track': {
      // boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
      // webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
    },
    '&::-webkit-scrollbar-thumb': {
      marginRight: '2px',
      borderRadius: '10px',
      backgroundColor: '#e2e2e2',
    },
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

const Bucket = ({ title, cases }) => {
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

  const clos = { display: 'none' }
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
      <div className={classes.caseList}>
        {cases.map((obj, index) => (
          <Draggable
            key={obj.envelope_id}
            draggableId={String(obj.envelope_id)}
            index={index}
          >
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                <Case data={obj} open={open} />
              </div>
            )}
          </Draggable>
        ))}
      </div>
    </div>
  )
}

export default Bucket
