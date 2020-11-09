import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import TextField from '@material-ui/core/TextField'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'

// import image from '../../../icons/car.png'
// import userIcon from '../../../icons/user.svg'
// import phoneIcon from '../../../icons/phone.svg'
// import letterIcon from '../../../icons/letter.svg'
// import backsIcon from '../../../icons/backs.svg'
// import ccIcon from '../../../icons/CoreCharge.svg'
// import gearsIcon from '../../../icons/Gears.svg'
// import subletIcon from '../../../icons/GreenSublet.svg'
// import usbIcon from '../../../icons/USB.svg'
// import clockIcon from '../../../icons/Clock.svg'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  media: {
    height: 140,
  },
  newTag: {
    display: 'flex',
    padding: theme.spacing(2),
    backgroundColor: '#e2e2e2',
    fontSize: '12px',
    fontWeight: '300',
    color: 'red',
    cursor: 'pointer',
  },
  title: {
    display: 'flex',
    fontWeight: 700,
    fontSize: 14,
  },
  ins: {
    color: theme.palette.primary.main,
    marginLeft: 'auto',
    fontWeight: 100,
  },
  vin: {
    fontWeight: 100,
    color: '#aaaaaa',
  },
  user: {
    display: 'flex',
    color: '#f3ad2e',
    '& img': {
      marginRight: theme.spacing(1),
    },
  },
  userIcons: {
    marginLeft: 'auto',
    fontSize: '12px',
    '& img': {
      marginRight: theme.spacing(1),
    },
  },
  claimPit: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    fontWeight: '100',
  },
  status: {
    display: 'flex',
    justifyContent: 'space-between',
    color: '#aaaaaa',
    fontSize: '12px',
  },
  statusIcons: {
    '& img': {
      marginLeft: '2px',
    },
  },
  cardFooter: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(1),
    background: 'linear-gradient(to bottom, #aaaaaa, #e2e2e2)',
  },
  cardTime: {
    display: 'flex',
    justifyContent: 'space-between',
    '& > *': {
      fontSize: '12px',
    },
  },
  ecd: {},
  closedCaseList: {
    display: 'none',
  },
}))

const Case = ({ data, open }) => {
  const classes = useStyles()

  const [value, setValue] = useState()
  const [placeholder, setPlaceholder] = useState('# click to set a custom tag')

  const onChangeHandler = (e) => {
    setValue(e.target.value)
  }

  const onClickHandler = () => {
    setPlaceholder('')
  }

  return (
    <Card
      className={`${classes.root} ${!open ? classes.closedCaseList : null}`}
      draggable="true"
    >
      <TextField
        className={classes.newTag}
        placeholder={placeholder}
        value={value ? value : ''}
        onChange={onChangeHandler}
      />
      <CardContent>
        <Typography className={classes.title}>
          {`${data.vehicle.vehicle_production_year} ${data.vehicle.vehicle_make_desc} ${data.vehicle.vehicle_model}`}{' '}
          <span className={classes.ins}>TEB</span>
        </Typography>
        {/* <Typography className={classes.vin}>{`${vin}`}</Typography> */}
        <Typography className={classes.user}>
          {/* <img src={userIcon} alt="" /> Kristen Andujar */}
          {/* <div className={classes.userIcons}> */}
          {/* <img src={phoneIcon} alt="" />
            <img src={letterIcon} alt="" />
            <img src={backsIcon} alt="" /> */}
          {/* </div> */}
        </Typography>
        <Typography className={classes.claimPit}>
          <span>
            Claim #<b>R0234534-3</b>
          </span>
          <span>
            Plt #<b>N45-MW7</b>
          </span>
        </Typography>
        <Typography></Typography>
        {/* <Typography className={classes.status}>
          In status: 1d 12h 51m
          <div className={classes.statusIcons}> */}
        {/* <img src={ccIcon} alt="" />
            <img src={gearsIcon} alt="" />
            <img src={subletIcon} alt="" />
            <img src={usbIcon} alt="" /> */}
        {/* </div>
        </Typography> */}
      </CardContent>
      {/* <div className={classes.cardFooter}>
        <div className={classes.cardTime}>
          <Typography>Touch 2.5h</Typography>
          <Typography>Keys-to-keys 7d</Typography>
        </div>
      </div> */}
    </Card>
  )
}

export default Case
