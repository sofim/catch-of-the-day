var React = require('react');
var ReactDom = require('react-dom');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Navigation = ReactRouter.Navigation;
var History = ReactRouter.History ;
// -- enables browser-history ("push-state")
var createBrowserHistory = require('history/lib/createBrowserHistory');
//import createBrowserHistory from 'history/lib/createBrowserHistory';
//import { browserHistory } from 'react-router' ;


//...link helper-functions in helpers.js
var h = require('./helpers') ;


/*
  def app-komponente : <App />
*/
var App = React.createClass({
  getInitialState : function () {
    // state is still null/empty
    return {
      fishes : {} ,
      order : {}
    }
  } ,
  addFish : function(fish) {
    var timestamp = (new Date()).getTime();
    // update state object
    this.state.fishes['fish-'+timestamp] = fish ;
    // set state for fishes
    this.setState({ fishes : this.state.fishes });
  } ,
  render : function() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="my tagline" datum="2016-02-17 12:49"/>
        </div>
        <Order />
        <Inventory addFish={this.addFish} />
      </div>
    )
  }
});


/*
  def komponente : <AddFishForm />
*/
var AddFishForm = React.createClass({
  createFish : function(event) {
    // stop form from submitting
    event.preventDefault();
    // get data out of form and fill into fish-object
    var fish = {
      name : this.refs.name.value ,
      price : this.refs.price.value ,
      status : this.refs.status.value ,
      desc : this.refs.desc.value ,
      image : this.refs.image.value
    };
    //console.log(fish);
    //state of fish belongs to app, look there getInitial... and addFish - function
    // now add the fish to the App-State
    // this sounds goot, but does not work => App.addFish(fish) ;
    // we must adapt ==> <Inventory /> in kompo  App to <Inventory addFish={this.addFish} />
    //                                                feature of JSX called spread attributes:
    // ...analog in kompo App for kompo AddFishForm => <AddFishForm {...this.props} />
    this.props.addFish(fish);
    // reset form-fields
    this.refs.fishForm.reset();
  } ,
  render : function() {
    return (
      <form className="fish-edit" ref="fishForm" onSubmit={this.createFish}>
        <input type="text" ref="name" placeholder="Fish Name"/>
        <input type="text" ref="price" placeholder="Fish Price" />
        <select ref="status">
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <textarea type="text" ref="desc" placeholder="Desc"></textarea>
        <input type="text" ref="image" placeholder="URL to Image" />
        <button type="submit">+ Add Item </button>
      </form>
    )
  }
});



/*
  def komponente : <Header />
*/
var Header = React.createClass({
  render : function() {
    console.log(this.props);
    return (
      <header className="top">
        <h1>Header
          <span className="ofThe">
            <span className="of">of</span>
            <span className="the">the</span>
          </span>
        day</h1>
        <h3 className="tagline"><span>{this.props.tagline} von {this.props.datum}</span></h3>
      </header>
    )
  }
});

/*
  def komponente : <Order />
*/
var Order = React.createClass({
  render : function() {
    return (
      <h4>Order</h4>
    )
  }
});


/*
  def komponente : <Inventory />
*/
var Inventory = React.createClass({
  render : function() {
    return (
      <div>
        <h4>Inventory</h4>
        <hr />
        <AddFishForm {...this.props} />
      </div>
    )
  }
});


/*
  def komponente StorePicker : <StorePicker/>
*/
var StorePicker = React.createClass({
  mixins : [History] ,
  goToStore : function(event) {
    event.preventDefault();
    // get data from input out of DOM
    var storeId = this.refs.storeId.value;
    console.log("submitted form in StorePicker... StoreId is "+storeId);
    // transition from <StorePicker/> to <App/>
    this.history.pushState(null,'/store/' + storeId);
  } ,
  render : function() {
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
});


/*
  def komponente NotFound : <NotFound/>
*/
var NotFound = React.createClass({
  render : function() {
    return (
      <h1>Not Found!</h1>
    )
  }
});

/*
  routes : jsx
*/

var routes = (
  /* <Router history={browserHistory}  > */
  <Router history={ createBrowserHistory()} >
    <Route path="/" component={StorePicker}/>
    <Route path="/store/:storeId" component={App}/>
    <Route path="*" component={NotFound}/>
  </Router>
)

ReactDom.render(routes, document.querySelector('#main'));
