/*
  def komponente : <Inventory />
*/

import React from 'react' ;
import AddFishForm from './AddFishForm';
import autobind from 'autobind-decorator';

@autobind
class Inventory extends React.Component {
  renderInventory(key) {
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
  }

  render(key) {
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

} ;

Inventory.propTypes = {
  addFish : React.PropTypes.func.isRequired ,
  loadSamples : React.PropTypes.func.isRequired ,
  fishes : React.PropTypes.object.isRequired ,
  linkState : React.PropTypes.func.isRequired ,
  removeFish : React.PropTypes.func.isRequired 
} ;

export default Inventory ;
