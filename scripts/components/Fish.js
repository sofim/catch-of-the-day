/*
  def komponente : <Fish />
*/

import React from 'react' ;
import h     from '../helpers' ;
import autobind from 'autobind-decorator';

@autobind
class Fish extends React.Component {
  onButtonClick(event) {
    console.log("should now add this stinky fish", this.props.index);
    //add this key (fish) to the order-state, i.e. function-def in App !
    this.props.addToOrder(this.props.index);
  }

  render() {
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
  }

};

export default Fish ;
