import React from 'react'
import { withStyles, makeStyles } from '@material-ui/core/styles'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginRight: theme.spacing(4),
    },
  },
}))

const IOSSwitch = withStyles((theme) => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(16px)',
      color: theme.palette.primary.main,
      '& + $track': {
        backgroundColor: theme.palette.primary.main,
        opacity: '.5',
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      color: theme.palette.gray.lite,
      border: '1px solid #fff',
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 26 / 2,
    border: 'none',
    backgroundColor: theme.palette.gray.lite,
    opacity: '.5',
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  )
})

const Switcher = ({ label }) => {
  const classes = useStyles()

  const [state, setState] = React.useState({
    checked: true,
  })

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked })
  }

  return (
    <FormGroup className={classes.root}>
      <FormControlLabel
        control={
          <IOSSwitch
            checked={state.checked}
            onChange={handleChange}
            name="checked"
          />
        }
        label={label}
      />
    </FormGroup>
  )
}

export default Switcher
