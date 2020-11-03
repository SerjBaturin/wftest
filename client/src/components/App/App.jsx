import React, { Fragment, useEffect } from 'react'
import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles'
import { Container } from '@material-ui/core'

import SignIn from '../pages/SignIn'
import Companies from '../pages/Companies'
import Header from '../Header'
import BucketList from '../BucketList'
import axios from 'axios'

const useStyles = makeStyles((theme) => ({
  app: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '95vh',
  },
}))

const App = ({ user, pingSaga }) => {
  const classes = useStyles()

  return (
    // <div>
    //   <Header />
    //   <BucketList />
    // </div>
  
   <Container component="main" maxWidth="xs">
     <div className={classes.app}>
       {user.user_id ? (
         <Companies companies={user.company_list} />
      ) : (
        <SignIn />
      )}
    </div>
  </Container>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.login,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    pingSaga: () => dispatch({ type: 'PING_ASYNC' }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
