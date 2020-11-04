import React from 'react'
import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'

import Bucket from './Bucket'

const useStyles = makeStyles((theme) => ({
  bucketList: {
    display: 'flex',
    marginTop: theme.spacing(5),
    marginLeft: '-24px',
    color: theme.palette.white.main,
    listStyle: 'none',
  },
  loader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100vh',
  },
}))

const BucketList = ({ cases }) => {
  const classes = useStyles()

  const casesList = (bucketStatusId) => {
    let result = []
    const params = cases.params.data
    const casesArr = cases.cases.data
    const wf_params = params.filter(param => param.param_name === 'wf_status')
    wf_params.map((obj) => {
      const envID = Number(obj.envelope_id)
      const statusID = Number(obj.param_value)
      const caseObj = casesArr.filter(obj => obj.envelope_id === envID)
      if (bucketStatusId === statusID) {
        result.push(caseObj)
      }
    })
    return result
  }

  if (cases) {
    return (
      <ul className={classes.bucketList}>
        {cases.config.data.list.map((bucket) => (
          <li key={bucket._id}>
            <Bucket title={bucket.name} cases={casesList(Number(bucket.status_id))}/>
          </li>
        ))}
      </ul>
    )
  } else {
    return (
      <div className={classes.loader}>
        <CircularProgress />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    cases: state.cases,
  }
}

export default connect(mapStateToProps)(BucketList)
