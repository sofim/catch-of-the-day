/*
  def komponente NotFound : <NotFound/>
*/

import React from 'react' ;  //dependency looked up in folder node_modules

var NotFound = React.createClass({
  render : function() {
    return (
      <h1>Not Found!</h1>
    )
  }
});

// we must export it to be able to import it in main.js
export default NotFound ;
