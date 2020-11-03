import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Button, Container } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  companies: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    margin: theme.spacing(0, 0, 1),
    width: '100%',
    color: '#fff',
    borderRadius: '100px',
  },
  logOut: {
    marginTop: theme.spacing(3),
  },
}))

const Companies = ({ companies }) => {
  const classes = useStyles()
  
  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.companies}>
        {companies.map((item) => (
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            key={item.company_id}
          >
            {item.company_name}
          </Button>
        ))}
      </div>
      <Button
        className={`${classes.button} ${classes.logOut}`}
        variant="contained"
        color="secondary"
      >
        Log out
      </Button>
    </Container>
  )
}

export default Companies
