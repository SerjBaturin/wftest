import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  filterBtn: {
    borderRadius: '100px',
  },
}))

const FilterBtn = ({ title }) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Button className={classes.filterBtn} variant="outlined" color="primary">
        <ArrowDropDownIcon />
        {title}
      </Button>
    </div>
  )
}

export default FilterBtn
