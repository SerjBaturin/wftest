import React from 'react'
import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress';

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
  }
}))

const BucketList = ({ cases }) => {
  const classes = useStyles()

  if (cases) {
    return (
      <ul className={classes.bucketList}>
        {cases.config.data.list.map((bucket) => (
          <li key={bucket._id}>
            <Bucket title={bucket.name} />
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
