/*
  def komponente : <Header />
*/

import React from 'react' ;  //dependency looked up in folder node_modules

class Header extends React.Component {
  render() {
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
}

//validation:
Header.propTypes = {
  tagline : React.PropTypes.string.isRequired
}

// we must export it to be able to import it in main.js
export default Header ;
