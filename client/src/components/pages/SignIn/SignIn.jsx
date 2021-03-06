import React, { useState } from 'react'
import { connect } from 'react-redux'

import { loginActionAsync } from '../../../redux/actions'
import { pingActionAsync } from '../../../redux/actions'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    marginTop: theme.spacing(1),
    width: '100%', // Fix IE 11 issue.
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    color: '#fff',
    borderRadius: '100px',
  },
}))

const SignIn = ({ loginSaga, pingSaga }) => {
  const classes = useStyles()

  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e) => {
    setLogin(e.target.value)
  }

  const handlePassword = (e) => {
    setPassword(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await loginSaga({ login: login, passwd: password })
    pingSaga()
    setLogin('')
    setPassword('')
  }

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            value={login}
            id="email"
            label="Login"
            name="email"
            autoComplete="off"
            autoFocus
            onChange={handleLogin}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            value={password}
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="off"
            onChange={handlePassword}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Log In
          </Button>
        </form>
      </div>
    </Container>
  )
}

const mapDispatchToProps = (dispatch) => {
  return {
    loginSaga: (data) => dispatch(loginActionAsync(data)),
    pingSaga: () => dispatch(pingActionAsync())
  }
}

export default connect(null, mapDispatchToProps)(SignIn)
