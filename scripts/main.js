import React from 'react';
import ReactDom from 'react-dom';


/* -- refactoring this in lesson 22:
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
...to this: */
import {Router , Route} from 'react-router' ; //with es6 : just import modules needed

// -- https://github.com/reactjs/history
// -- enables browser-history ("push-state")
//var createBrowserHistory = require('history/lib/createBrowserHistory'); //--until lesson 22
//--on within lesson 22:
import { browserHistory } from 'react-router';

//import our own components(ES6-way of do a "rquire")
import NotFound    from './components/NotFound';
import StorePicker from './components/StorePicker';
import App         from './components/App';              //...importiert selber ...

/*
  routes : jsx
*/
var routes = (
  /* <Router history={ createBrowserHistory() } > > */
  <Router history={ browserHistory } >
    <Route path="/" component={StorePicker}/>
    <Route path="/store/:storeId" component={App}/>
    <Route path="*" component={NotFound}/>
  </Router>
)

ReactDom.render(routes, document.querySelector('#main'));
