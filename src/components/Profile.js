import React, { PureComponent } from 'react';
import axios from 'axios'
import { token$ } from '../Store';
import jwt from 'jsonwebtoken';
import '../App.css';
import { Helmet } from 'react-helmet';
import { Redirect } from 'react-router-dom';
import { Person } from '@material-ui/icons';
const API_ROOT = 'http://ec2-13-53-32-89.eu-north-1.compute.amazonaws.com:3000';

class Profile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      token: token$.value,
      todos: [],
      email: '',
      todoName: '',
    }
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddTodo = this.handleAddTodo.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  componentDidMount() {
    this.source = axios.CancelToken.source();
    this.subscription = token$.subscribe((token) => {
      this.setState({ token: token })
    })
    const decoded = jwt.decode(this.state.token);
    this.setState({ email: decoded.email })
      axios.get(API_ROOT + '/todos', { headers: { Authorization: 'Bearer ' + token$.value, cancelToken: this.source.token }, 
      })
      .then((response) => {
          this.setState({ todos: response.data.todos })
      })
      .catch((error) => {
          if (axios.isCancel(error)) {
            return;
          }
          if (error.response.status >= 400 && error.response.status < 500)  {
            this.setState({ error: 'Something went wrong. Please try again!' })
          } 
          else if (error.response.status <= 500) {
            this.setState({ error: 'Something wrong with the server. Please try again!' })
          }
          else {
            this.setState({ error: 'Something went wrong, please try again' })  
          } 
      })
  }

  handleAddTodo(e) {
    e.preventDefault();
    this.source = axios.CancelToken.source();
    axios.post(API_ROOT + '/todos', { content: this.state.todoName }, { headers: { Authorization: 'Bearer ' + token$.value, cancelToken: this.source.token },
      })
      .then((response) => {
        if (response.status === 201) {
          axios.get(API_ROOT + '/todos', 
          { headers: { Authorization: 'Bearer ' + token$.value },
      })
      .then((response) => {
        if (response.status === 200) {
          const newTodo = response.data.todos;
          this.setState({ todos: newTodo, todoName: "" });
        }
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          return;
        }
        if (error.response.status >= 400 && error.response.status < 500)  {
          this.setState({ error: 'Something went wrong. Please try again!' })
        } 
        else if (error.response.status <= 500) {
          this.setState({ error: 'Something wrong with the server. Please try again!' })
        }
        else {
          this.setState({ error: 'Something went wrong, please try again' })  
        } 
      })
      }})
    }

  handleInput(e) {
    this.setState({ todoName: e.target.value })
  }

  handleDelete(e) {
    const data = this.state.todos;
    const id = e.target.dataset.id;
    this.source = axios.CancelToken.source();
    axios.delete(API_ROOT + '/todos/' + id, { headers: { Authorization: 'Bearer ' + token$.value, cancelToken: this.source.token }
    })
    .then((response) => {
      const index = data.findIndex(x => x.id === id);
      if (index >= 0) {
        const newData = [...data.slice(0, index), ...data.slice(index + 1)];
        this.setState({ todos: newData})
    }
    })
    .catch(error => {
        if (axios.isCancel(error)) {
          return;
        }
        if (error.response.status >= 400 && error.response.status < 500)  {
          this.setState({ error: 'Something went wrong. Please try again!' })
        } 
        else if (error.response.status <= 500) {
          this.setState({ error: 'Something wrong with the server. Please try again!' })
        }
        else {
          this.setState({ error: 'Something went wrong, please try again' })  
        } 
      })
    }

  logOut () {
    this.setState({ token: null })
  }

  componentWillUnmount(){
		if (this.source) {
		  this.source.cancel();
    }
    this.subscription.unsubscribe();
	}

  render() {
    if (this.state.token === null) {
      return(<Redirect to="/" />)
    }
    const data = this.state.todos
    return (
      <>
      <Helmet>
        <title>Todos - profile</title>
      </Helmet>
      <div className="todo-login-wrapper">
          <span className="todo-login-personWrapper"><Person id="login-icon-person" /></span><span className="login-text">{ this.state.email }</span><button className="todo-profile-logout" onClick={ this.logOut }><i className="material-icons icon-clear-logout">clear</i></button><br />
      </div>
      <div className="todo-wrapper">
        <div className="todo-box">
        <form onSubmit={ this.handleAddTodo }>
          <h2>What do you want Todo?</h2>
          <input type="text" minLength="1" maxLength="100" className="todo-profile-input" onChange={ this.handleInput } value={this.state.todoName} ></input>
          <div className="todo-profile-buttonWrapper">
            <button className="todo-profile-AddButton">Add Todo</button>
          </div>
        </form>
        <ul className="todo-profile-list">
          {data.slice(0).reverse().map(x => <li className="todo-profile-list-item" key={x.id}>{x.content}<button className="todo-profile-delete" data-id={ x.id } onClick={ this.handleDelete }><i className="material-icons icon-clear">clear</i></button></li>)}
        </ul>
        </div>
      </div>
      </>
    )
  }
}

export default Profile;
