import React from 'react'
import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles'
import { Container } from '@material-ui/core'

import SignIn from '../pages/SignIn'
import Companies from '../pages/Companies'
import Main from '../pages/Main'

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

const App = ({ user, companyId }) => {
  const classes = useStyles()
  return (
    <>
      {user.user_id ? (
        companyId ? (
          <Main companyId={companyId} />
        ) : (
          <Container component="main" maxWidth="xs">
            <div className={classes.app}>
              <Companies companies={user.company_list} companyId={companyId} />
            </div>
          </Container>
        )
      ) : (
        <Container component="main" maxWidth="xs">
          <div className={classes.app}>
            <SignIn />
          </div>
        </Container>
      )}
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.login,
    companyId: state.companyId,
  }
}

export default connect(mapStateToProps)(App)
