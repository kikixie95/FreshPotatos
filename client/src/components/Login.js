import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import LockOutlinedIcon from '@material-ui/icons/Lock';
import EmailIcon from '@material-ui/icons/Email';
import PasswordIcon from '@material-ui/icons/VpnKey';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  icon: {
    margin: theme.spacing(2),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
  grid: {
    padding: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(2, 0, 2),
  },
}));

// function to check login, then store `is_admin` and `token` in session storage
function login(email, password) {
  const emailPatternChecker = email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
  if (email === '' || password === '') {
    window.alert("invalid email or password");
  } else if(emailPatternChecker) {
    fetch('https://web-final-demo.azurewebsites.net/api/user/login', {
      method: 'POST',
      body: JSON.stringify({'email': email, 'password': password}),
      headers: new Headers({ 'Content-Type': 'application/json' })
    })
    .then(res => res.json())
    .then(response => {
      if (response.auth){
        window.sessionStorage.setItem('is_login', response.auth);
        window.sessionStorage.setItem('is_admin', response.isAdmin);
        window.sessionStorage.setItem('token', response.token);
        window.sessionStorage.setItem('name', response.name);
        window.sessionStorage.setItem('email', response.email);
        window.location.href='/';
      }else{
        window.alert('email or password error');
      }
    });
  } else {
    window.alert("Email format error");
  }
}

// Login component
class Login extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
    this.showEmailInput = this.showEmailInput.bind(this);
    this.showPasswordInput = this.showPasswordInput.bind(this);
    this.showButtons = this.showButtons.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
  }

  showEmailInput(){
    return (
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        value={this.state.email}
        onChange={this.handleChangeEmail}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailIcon />
            </InputAdornment>
          ),
        }}
        type='email'
        autoComplete="email"
        autoFocus
      />
    )
  }

  showPasswordInput(){
    return (
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="password"
        label="Password"
        name="password"
        value={this.state.password}
        onChange={this.handleChangePassword}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PasswordIcon />
            </InputAdornment>
          ),
        }}
        type="password"
        autoComplete="current-password"
      />
    )
  }

  showButtons(){
    return (
      <Grid container>
        <Grid item xs className={this.props.classes.grid}>
          {/* login button */}
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            className={this.props.classes.submit}
            onClick={(e) => {e.preventDefault(); login(this.state.email, this.state.password)}}
          >
            Sign In
          </Button>
        </Grid>
        <Grid item xs className={this.props.classes.grid}>
          {/* sign up button */}
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            className={this.props.classes.submit}
            href='/signup'
          >
            Sign Up
          </Button>
        </Grid>
      </Grid>
    )
  }

  // functions to handle state change
  handleChangeEmail(event) { this.setState({email: event.target.value}); }
  handleChangePassword(event) { this.setState({password: event.target.value}); }

  render(){
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={this.props.classes.paper}>
          {/* login avatar */}
          <Avatar className={this.props.classes.icon}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h4">
            Sign in
          </Typography>
          <form className={this.props.classes.form} noValidate>
            {/* email input field*/}
            {this.showEmailInput()}
            {/* password input field */}
            {this.showPasswordInput()}
            {/* login and sign up buttons */}
            {this.showButtons()}
          </form>
        </div>
      </Container>
    );
  }
}

// use Hook to wrap styles classes with Login component
export default function Hook(props) {
  const classes = useStyles();
  return <Login classes={classes} routerProps={props}>Hook</Login>;
}