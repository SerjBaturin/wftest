import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Case from './Case'
import { oneCase } from './oneCase'

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '0',
    padding: '0',
    width: '100%',
    height: '100%',
    listStyle: 'none',
  },
}))

const CaseList = () => {
  const classes = useStyles()
  return (
    <ul className={classes.root}>
      {oneCase.map((item) => (
        <li key={item.envelope_id}>
          <Case
            id={item.envelope_id}
            desc={item.vehicle.vehicle_make_desc}
            model={item.vehicle.vehicle_model}
            year={item.vehicle.vehicle_production_year}
            vin={item.vehicle.vehicle_vin}
          />
        </li>
      ))}
    </ul>
  )
}

export default CaseList
