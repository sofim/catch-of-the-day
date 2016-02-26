/*
  def komponente StorePicker : <StorePicker/>
*/

import React from 'react' ;  //dependency looked up in folder node_modules
import h     from '../helpers' ;
import { browserHistory } from 'react-router';
//import reactMixin from 'react-mixin' ;
import autobind from 'autobind-decorator';

@autobind
class StorePicker extends React.Component {

  goToStore(event) {
    //console.log(this) ;
    event.preventDefault();
    // get data from input out of DOM
    var storeId = this.refs.storeId.value;
    console.log("submitted form in StorePicker... StoreId is "+storeId);
    browserHistory.push('/store/' + storeId);
  }

  render() {
    //console.log(this) ;
    var userName = "housi-pesche" ;
    return (
      <form className="store-selector" onSubmit={this.goToStore}>
        {/* curly-braces and then block-comments are comments */}
        <h2>please enter a store {userName}</h2>
        <input type="text" ref="storeId" defaultValue={h.getFunName()} required />
        <input type="Submit" />
      </form>
    )
  }

}

//...evtl. hier mixins einbinden, pro zeile eines.
//reactMixin.onClass(StorePicker, Navigation) ;

// we must export it to be able to import it in main.js
export default StorePicker ;
