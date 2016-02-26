/*
  def app-komponente : <App />
*/
import React from 'react' ;
import Catalyst from 'react-catalyst' ;

//firebase
import Rebase from 're-base' ;
var base = Rebase.createClass('https://sweltering-fire-6318.firebaseio.com/');

import Fish from './Fish';
import Order from './Order';
import Inventory from './Inventory';  //...importiert selber AddFishForm
import Header from './Header';


var App = React.createClass({
  mixins : [Catalyst.LinkedStateMixin] ,
  getInitialState : function () { //react-api
    // state is still null/empty
    return {
      fishes : {} , //persistence: firebase
      order : {}    //persistence: localstorage (da user-spezifisch)
    }
  } ,
  //from facebook.github.io/react/docs/component-specs.html
  componentDidMount : function() { //react-api
    console.log(">>>>>>> component did mount");
    base.syncState(this.props.params.storeId + '/fishes', {
      context : this,
      state : 'fishes'
    });
    // load from localStorage
    var localStorageRef = localStorage.getItem('order-' + this.props.params.storeId);
    if (localStorageRef) {//...it is not a brand-new=empty store...
      //update state of component
      //...you must un-stringify value and set it in state
      this.setState({
        order : JSON.parse(localStorageRef)
      });
    }
  } ,
  componentWillUpdate : function(nextProps, nextState) {
    console.log(">>>>>>> componentWillUpdate" , nextState);
    //...add new state zu localStorage (=one huge object)
    //   key and value (value must be string)
    localStorage.setItem('order-' + this.props.params.storeId, JSON.stringify(nextState.order));
    //...if browser refreshes, you have to pluck this value againg => done in componentDidMount

  } ,
  addToOrder : function(key) {
    this.state.order[key] = this.state.order[key] + 1 || 1; //incre or set to 1 => no of ordered fishes of same key
    this.setState({ order : this.state.order });
  } ,
  removeFromOrder : function(key) {
    //update order state object and re-set it
    delete this.state.order[key] ;
    this.setState({ order : this.state.order });
  } ,
  addFish : function(fish) {
    var timestamp = (new Date()).getTime();
    // update state object
    this.state.fishes['fish-'+timestamp] = fish ;
    // set state for fishes
    this.setState({ fishes : this.state.fishes });
  } ,
  removeFish : function(key) {
    console.log("user wants to remove this fish: " , this.state.fishes[key].name);
    if (confirm("Are You Sure? Fish " + this.state.fishes[key].name + " will be removed...") ) {
      //attention please: fish is going to be removed !!!
      this.state.fishes[key] = null ;
      this.setState({ fishes : this.state.fishes });
    }

  } ,
  loadSamples : function() {
    this.setState({ fishes : require('../sample-fishes.js') });
  } ,
  renderFish : function(key) { //for each fish in fishes !
    /* just for testing
    return (
      <li>Welcome Fish with key : {key}</li>
    )
    */
    return ( <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder} /> )
  } ,
  render : function() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="my tagline" datum="2016-02-17 12:49"/>
          <ul className="list-of-fishes">
            {Object.keys(this.state.fishes).map(this.renderFish) }
          </ul>
        </div>
        <Order fishes={this.state.fishes}
          order={this.state.order}
          removeFromOrder={this.removeFromOrder}
        />
        <Inventory addFish={this.addFish}
          loadSamples={this.loadSamples}
          fishes={this.state.fishes}
          linkState={this.linkState}
          removeFish={this.removeFish}
        />
      </div>
    )
  }
});


export default App ;
