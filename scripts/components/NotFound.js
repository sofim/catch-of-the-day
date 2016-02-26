/*
  def komponente NotFound : <NotFound/>
  rewritten as ES6-class
*/

import React from 'react' ;  //dependency looked up in folder node_modules

class NotFound extends React.Component {
  render() {
    return (
      <h1>Not Found! Nevermind: I am an ES6-class now</h1>
    )
    /* next method follows without comma as separator */
  }
}

/*
var NotFound = React.createClass({
  render : function() {
    return (
      <h1>Not Found!</h1>
    )
  }
});
*/

// we must export it to be able to import it in main.js
export default NotFound ;
