/*
  def komponente : <AddFishForm />
*/

import React from 'react' ;

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

export default AddFishForm ;
