/*
  def komponente : <Inventory />
*/

import React from 'react' ;
import AddFishForm from './AddFishForm';
import autobind from 'autobind-decorator';
import Firebase from 'firebase' ;
const fbref = new Firebase('https://sweltering-fire-6318.firebaseio.com/') ;

@autobind
class Inventory extends React.Component {

  constructor() {
    super();
    this.state = {
      uid : ''
    }
  }

  componentWillMount() { //react-api
    var loginToken = localStorage.getItem('login-token');
    if (loginToken) {
      fbref.authWithCustomToken(loginToken, this.authHandler) ;
    }
  }

  logout() {
    console.log("ByeByeBaby...");
    fbref.unauth();
    localStorage.removeItem('login-token');
    this.setState({
      uid : null
    });
  }

  authenticate(provider) {
    console.log("...trying to log with ", provider) ;
    fbref.authWithOAuthPopup(provider, this.authHandler);
  }

  authHandler(err, authData) {
    if (err) {
      console.error(err);
      return ;
    }
    //...save the login token in the browser
    localStorage.setItem('login-token' , authData.token ) ;

    //...no err:
    const storeRef = fbref.child(this.props.params.storeId) ;
    console.log("storeRef:" , storeRef) ;
    storeRef.on('value' , (snapshot)=> {
      var data = snapshot.val() || {} ; //store-values if any or "empty"
      if (!data.owner) {
        //claim it as our own if there is no owner
        storeRef.set({
          owner : authData.uid
        });
      }
      //...set uid and owner
      this.setState({
        uid : authData.uid ,
        owner : data.owner || authData.uid
      });
    });
  } ;

  renderLogin() {
    return (
      <nav className="login">
        <h2>Inventory</h2>
        <p>Sign in to manage your store's inventory</p>
        <button className="github"   onClick={this.authenticate.bind(this, 'github')}>Log In with Github</button>
        <button className="facebook" onClick={this.authenticate.bind(this, 'facebook')}>Log In with Facebook</button>
        <button className="twitter"  onClick={this.authenticate.bind(this, 'twitter')}>Log In with Twitter</button>
      </nav>
    )
  }

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

    //let ==> es6 : gueltig fuer block. define logut button
    let logoutButton = <button onClick={this.logout} >Log Out</button> ;

    // check if one is logged in
    if (!this.state.uid) { //...no one is...
      return (
        <div>{this.renderLogin()}</div>
      )
    }
    // check if logged in user is store owner
    if (this.state.uid !== this.state.owner)  {//...user is not owner...
      return (
        <div>
          <p>Sorry my friend. You are not the Store Owner. Inventory is not displayed.</p>
          {logoutButton}
        </div>
      )
    }

    return (
      <div>
        <h4>Inventory</h4>
        {logoutButton}

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
