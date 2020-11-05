import React from 'react'
import { connect } from 'react-redux'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'

import { updateCases, updateCasesAsync } from '../../redux/actions'

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

const BucketList = ({ buckets, updateCases, updateCasesAsync, companyId, userId }) => {
  const classes = useStyles()

  const onDragEnd = (result, buckets) => {
    if (!result.destination) return
    const { source, destination } = result
    if (source.droppableId !== destination.droppableId) {
      const sourceBucket = buckets.find((bucket) => String(bucket.status_id) === source.droppableId)
      const destinationBucket = buckets.find((bucket) => String(bucket.status_id) === destination.droppableId)
      const sourceCases = [...sourceBucket.cases]
      const destinationCases = [...destinationBucket.cases]
      const [removed] = sourceCases.splice(source.index, 1)
      destinationCases.splice(destination.index, 0, removed)
      buckets.map(bucket => {
        if (bucket.status_id === source.droppableId) {
          bucket.cases = sourceCases
        }
        if (bucket.status_id === destination.droppableId) {
          bucket.cases = destinationCases
        }
      })
      const obj = {
        company_id: companyId,
        date: '',
        envelope_id: result.draggableId,
        from_wf_status: source.droppableId,
        to_wf_status: destination.droppableId,
        user_id: userId
      }
      updateCasesAsync(obj)
      updateCases(buckets)      
    } 
  }

  if (buckets) {
    return (
      <DragDropContext onDragEnd={(result) => onDragEnd(result, buckets)}>
        <ul className={classes.bucketList}>
          {buckets.map((bucket) => (
            <Droppable droppableId={String(bucket.status_id)}>
              {(provided, snapshot) => (
                <li key={bucket._id}>
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    <Bucket title={bucket.name} cases={bucket.cases} />
                    {provided.placeholder}
                  </div>
                </li>
              )}
            </Droppable>
          ))}
        </ul>
      </DragDropContext>
    )
  } else {
    return (
      <div className={classes.loader}>
        <CircularProgress />
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateCases: (data) => dispatch(updateCases(data)),
    updateCasesAsync: (data) => dispatch(updateCasesAsync(data))
  }
}

const mapStateToProps = (state) => {
  return {
    buckets: state.cases,
    companyId: state.companyId,
    userId: state.ping.user_id
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BucketList)
