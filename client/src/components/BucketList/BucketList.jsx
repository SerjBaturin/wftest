import React from 'react'
import { buckets } from '../../api'

import { makeStyles } from '@material-ui/core/styles'

import Bucket from './Bucket'

const useStyles = makeStyles((theme) => ({
  bucketList: {
    display: 'flex',
    marginTop: theme.spacing(5),
    marginLeft: '-24px',
    color: theme.palette.white.main,
    listStyle: 'none',
  },
}))

const BucketList = () => {
  const classes = useStyles()

  return (
    <ul className={classes.bucketList}>
      {buckets.data.list.map((bucket) => (
        <li key={bucket._id}>
          <Bucket title={bucket.name} />
        </li>
      ))}
    </ul>
  )
}

export default BucketList
