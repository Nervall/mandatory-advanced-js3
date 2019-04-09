import React, { PureComponent } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Login from './components/Login.js'
import Register from './components/Register'
import Profile from './components/Profile.js'

class App extends PureComponent {

  render() {
    return (
      <Router>
        <nav>
          <div className="todo-wrap-register"><Link id="todo-link-register" to="Register">Register</Link></div>
          <div className="todo-wrap-login"><Link id="todo-link-login" to="/">Login</Link></div>
        </nav>
        <Route exact path='/' component={ Login } />
        <Route path='/register' component={ Register } />
        <Route path='/profile' component={ Profile } />
      </Router>
    );
  }
}

export default App;

