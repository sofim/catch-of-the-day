var React = require('react');
var ReactDom = require('react-dom');

/*
  def app-komponente : <App />
*/
var App = React.createClass({
  render : function() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header />
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
    return (
      <h4>Header</h4>
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

ReactDom.render(<App/>, document.querySelector('#main'));
