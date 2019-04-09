import React, { PureComponent } from 'react';
import axios from 'axios';
import '../App.css';
import { Link, Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
//import { token$ } from '../Store';
import { updateToken } from '../Store';
import BackgroundVideo from '../smoke_3.mp4';
const API_ROOT = 'http://ec2-13-53-32-89.eu-north-1.compute.amazonaws.com:3000';



class Login extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            loggedIn: '',
            error: '',
        }
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleEmail = this.handleEmail.bind(this);
      this.handlePassword = this.handlePassword.bind(this);
    }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ error: '' });
    this.source = axios.CancelToken.source();
    axios.post(API_ROOT + '/auth', { email: this.state.email, password: this.state.password }, {cancelToken: this.source.token})
    .then((response) => {
        const token = response.data.token
        updateToken(token);
        this.setState({ loggedIn: true })
    })
    .catch((error) => {
        if (axios.isCancel(error)) {
          return;
        }
        if (error.response.status === 401) {
          this.setState({ error: 'You are not authorized. Please try again!' })
        } 
        else if (error.response.status === 400) {
          this.setState({ error: 'Your email or password is not correct. Please try again!' })
        } 
        else if (error.response.status <= 500) {
          this.setState({ error: 'Something wrong with the server. Please try again!' })
        }
        else {
          this.setState({ error: 'Something went wrong, please try again' })  
        } 
    })
  }

  handleEmail(e) {
    this.setState({ email: e.target.value })
  }

  handlePassword(e) {
    this.setState({ password: e.target.value })
  }

  componentWillUnmount(){
		if (this.source) {
		  this.source.cancel();
    }
	}

  render() {
      
    if (this.state.loggedIn) {
      return (<Redirect to='/profile' />)
    }
    return (
      <>
      <Helmet>
        <title>Todos - Login</title>
      </Helmet>
      <video id='videoTag' autoPlay muted>
      <source src={ BackgroundVideo } type='video/mp4' />
      </video>
      <div className="todo-wrapper">
        <h1>Todos</h1>
        <form onSubmit={ this.handleSubmit } autoComplete="on">
            <label htmlFor="email">Email</label><br />
            <input type="email" id="todo-input-email" onChange={ this.handleEmail }></input><br />
            <label htmlFor="password" >Password</label><br />
            <input type="password" id="todo-input-password" name="password" onChange={ this.handlePassword }></input><br />
            <button id="todo-submit-button">Log in</button>
            <p>New user? <Link to="/register">Register here</Link></p>
        </form>
        <p style={{ color: "red"}}>{ this.state.error }</p>
      </div>
      </>
    );
  }
}

export default Login;



