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

//firebase
var Rebase = require('re-base') ;
var base = Rebase.createClass('https://sweltering-fire-6318.firebaseio.com/');

//import catalyst in our app
var Catalyst = require('react-catalyst');


/*
  def app-komponente : <App />
*/
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
    this.setState({ fishes : require('./sample-fishes.js') });
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


/*
  def komponente : <Fish />
*/
var Fish = React.createClass({
  onButtonClick : function(event) {
    console.log("should now add this stinky fish", this.props.index);
    //add this key (fish) to the order-state, i.e. function-def in App !
    this.props.addToOrder(this.props.index);
  } ,
  render : function() {
    var details = this.props.details ;
    var isAvailable = ( details.status === 'available' ? true : false ) ;
    var buttonText = ( isAvailable ? 'Add To Order' : "SOLD OUT" ) ;
    return (
      <li className="menu-fish">
        <img src={details.image} alt={details.name} />
        <h3 className="fish-name">
          {details.name}
          <span className="price">{h.formatPrice(details.price)}</span>
        </h3>
        <p>{details.desc}</p>
        <button disabled={!isAvailable} onClick={this.onButtonClick}>{buttonText}</button>
      </li>
    )
  } ,

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
          <option value="available">On Stock</option>
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
  renderOrder : function(key) {
    var fish = this.props.fishes[key];
    var count = this.props.order[key];
    //knopf programmatisch definieren zum einsetzen in return ...
    var removeButton = <button onClick={this.props.removeFromOrder.bind(null,key)}>&times;</button> ;
    //console.log("hier order: ", JSON.stringify(this.props.fishes) === '{}');
    //...falls fishes noch nich gefuellt ist:
    if (JSON.stringify(this.props.fishes) === '{}') {
      return(<li key={key}> sorry, wait a second...</li>)
    }
    //...falls fischi in order von user aus inventar geloescht wurde:
    if (!fish) {
      return(<li key={key}> sorry, diesen fisch gibt es nümme... {removeButton}</li>)
    }
    return (
      <li key={key}>
        <span>{count}</span>lbs
        {fish.name}
        <span className="price">{h.formatPrice(count * fish.price)}</span>
        {removeButton}
      </li>
    )
  } ,
  render : function(key) {
    var orderIds = Object.keys(this.props.order); //arr of all ordered fishes
    var total = orderIds.reduce((prevTotal, key)=>{
      var fish = this.props.fishes[key];
      var count = this.props.order[key];
      var isAvailable = fish && fish.status === 'available' ;
      if (fish && isAvailable) {
        return prevTotal + parseInt(fish.price * count || 0) ;
      }
      //in no fish or not available
      return prevTotal ;
    },0) ; //,0 : wert, falls orderIds leer ist, was am anfang so ist.

    return (
      <div className="order-wrap">
        <h2 className="order-title">Your Order</h2>
        <ul className="order" key={key}>
          {orderIds.map(this.renderOrder)}
          <li className="total">
            <strong>Total:</strong>
            {h.formatPrice(total)}
          </li>
        </ul>
      </div>
    )
  }
});


/*
  def komponente : <Inventory />
*/
var Inventory = React.createClass({
  renderInventory : function(key) {
    var fish = this.props.fishes[key] ;
    var linkState = this.props.linkState ;
    return (
      <div className="fish-edit" key={key}>
        {/* geht nicht mit fish.name : <input type="text" valueLink={linkState(fish.name)} /> */}
        {/* aber zur anzeige des namens allein geht es...*/}
        <input type="text" valueLink={linkState('fishes.'+key+'.name')} />
        <input type="text" valueLink={linkState('fishes.'+key+'.price')} />
        <select valueLink={linkState('fishes.'+key+'.status')}>
          <option value="available">On Stock</option>
          <option value="unavailable">Sold out</option>
        </select>
        <textarea valueLink={linkState('fishes.'+key+'.desc')}></textarea>
        <input type="text" valueLink={linkState('fishes.'+key+'.image')} />
        <button onClick={this.props.removeFish.bind(null,key)}>Remove Fish</button>
      </div>
    )

  },
  render : function(key) {
    return (
      <div>
        <h4>Inventory</h4>
        {/* alle fische auflisten */}
        {Object.keys(this.props.fishes).map(this.renderInventory)}
        <hr />
        <AddFishForm {...this.props} />
        <button onClick={this.props.loadSamples}>Load Sample Data</button>

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
