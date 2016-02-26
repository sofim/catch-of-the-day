/*
  def komponente : <Order />
*/

import React from 'react' ;
import h     from '../helpers' ;
import CSSTransitionGroup from 'react-addons-css-transition-group' ;


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
        <span>
          <CSSTransitionGroup
            component="span"
            transitionName="count"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={500}
            className="count"
          >
            <span key={count}>{count}</span>
          </CSSTransitionGroup>
          &nbsp; lbs &nbsp; {fish.name} &nbsp; {removeButton}
        </span>
        <span className="price">{h.formatPrice(count * fish.price)}</span>
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
    },0) ; //,0 ==> wert, falls orderIds leer ist, was am anfang so ist.

    return (
      <div className="order-wrap">
        <h2 className="order-title">Your Order</h2>
        <CSSTransitionGroup
            className="order"
            key={key} component="ul"
            transitionName="order"
            transitionEnterTimeout={1000}
            transitionLeaveTimeout={1000}
        >
          {orderIds.map(this.renderOrder)}
          <li className="total">
            <strong>Total:</strong>
            {h.formatPrice(total)}
          </li>
        </CSSTransitionGroup>
      </div>
    )
  }
});

export default Order ;
