import React, { PureComponent } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import '../App.css';
import { Link } from 'react-router-dom';
const API_ROOT = 'http://ec2-13-53-32-89.eu-north-1.compute.amazonaws.com:3000'

 class Register extends PureComponent {
   constructor(props) {
     super(props);
     this.state = {
       email: '',
       password: '',
       error: '',
       loggedin: '',
     }
     this.handleEmail = this.handleEmail.bind(this);
     this.handlePassword = this.handlePassword.bind(this);
     this.handleSubmit = this.handleSubmit.bind(this);
   }
  
  handleEmail(e) {
    this.setState({ email: e.target.value })
  }
  
  handlePassword(e) {
    this.setState({ password: e.target.value })
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ error: '' })
    this.source = axios.CancelToken.source();
    axios.post(API_ROOT + '/register', { email: this.state.email, password: this.state.password }, {cancelToken: this.source.token})
      .then((response) => {
        console.log(response.data)
        this.setState({ loggedin: <div>'You are now registered, you can no go back and <Link to="/">Log in</Link></div> })
      })
      .catch((error) => {
          console.log(error);
          if (axios.isCancel(error)) {
            return;
          }
          if (error.response.status === 400)  {
            this.setState({ error: 'Your email or password is not correct. Please try again!' })
          } 
          else if (error.response.status > 400 && error.response.status < 500)  {
            this.setState({ error: 'Something wrong with your email or password. Please try again!' })
          } 
          else if (error.response.status <= 500) {
            this.setState({ error: 'Something wrong with the server. Please try again!' })
          }
          else {
            this.setState({ error: 'Something went wrong, please try again' })  
          } 
      })
  }

  componentWillUnmount(){
		if (this.source) {
		  this.source.cancel();
		}
	}
  
  render() {
    return (
      <div className="todo-wrapper">
        <Helmet>
        <title>Todos - Register</title>
        </Helmet>
        <div id="todo-form">
        <h2>Register new user</h2>
        <form onSubmit={ this.handleSubmit }>
          <label htmlFor="email">E-post</label>
          <input type="email" name="email" id="todo-input-email" onChange={ this.handleEmail }></input><br />
          <label htmlFor="password">Password </label>
          <input type="password" name="password" id="todo-input-password" onChange={ this.handlePassword }></input><br />
          <button id="todo-submit-button">Add User</button><Link to="/"><button id="todo-back-button">Back</button></Link>
        </form>
        <p style={{ color: "red"}}>{ this.state.error }</p>
        { this.state.loggedin }
        </div>
      </div>
    )
  }
}

export default Register;