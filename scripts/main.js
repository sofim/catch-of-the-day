var React = require('react');
var ReactDom = require('react-dom');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Navigation = ReactRouter.Navigation;
// -- enables browser-history ("push-date")
var crateBrowserHistory = require('history/lib/createBrowserHistory');

/*
  def app-komponente : <App />
*/
var App = React.createClass({
  render : function() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="my tagline" datum="2016-02-17 12:49"/>
        </div>
        <Order />
        <Inventory />
      </div>
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
      <h4>Inventory</h4>
    )
  }
});


/*
  def komponente StorePicker : <StorePicker/>
*/
var StorePicker = React.createClass({
  render : function() {
    var userName = "housi-pesche" ;
    return ( //--here starts JSX
      <form className="store-selector">
        {/* curly-braces and then block-comments are comments */}
        <h2>please enter a store {userName}</h2>
        <input type="text" ref="storeId" required />
        <input type="submit" />
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
  <Router history={crateBrowserHistory()}>
    <Route path="/" component={StorePicker}/>
    <Route path="/store/:storeId" component={App}/>
    <Route path="*" component={NotFound}/>
  </Router>
)

ReactDom.render(routes, document.querySelector('#main'));
