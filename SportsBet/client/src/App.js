import React, { Component } from 'react';

import './App.css';

class App extends Component {
  constructor() {
    super();

    this.state = {
      pets : [{_id: 1, name: 'fido'}, {_id: 2, name: 'snowflake'}],
      name : 'will',
      edit_id : ''
    }

    // this.editPet = this.editPet.bind(this);
  }

  // deletePet() {
  //   alert('hi');
  // }

  deletePet = (event) => {

    //in button below add a data attribute with the pet's id

    var id = event.target.getAttribute('data-id');

    return fetch(`http://localhost:3001/pets/${id}`, {
            method: "POST",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }).then(res => res.json()).then(deletedPetId => {

            let pets = this.state.pets.filter(pet => pet._id !== deletedPetId)

            this.setState({pets})
          })

    //and in deletePet, write the fetch call to delete the Pet


    //so you click a button, you refresh and it's gone

    //12:05
  }

  createPet = (event) => {
    event.preventDefault();

    let name = event.target.children[0].value;
    let type = event.target.children[1].value;

    return fetch("http://localhost:3001/pets", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({name, type})
      }).then(res => res.json()).then(rj => {
        let pets = [...this.state.pets, rj];
        this.setState({pets})
      })
  }

  updatePet = (event) => {
    event.preventDefault();

    let form = event.target;

    let updatedId = this.state.edit_id;
    let name = form.children[0].value;
    let type = form.children[1].value;

    return fetch(`http://localhost:3001/pets/update/${updatedId}`, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name, type})
    }).then(res => res.json()).then(updatedPet => {

      let pets = this.state.pets.map(oldPet => {
        //if the pet in this.state.pets is not the pet we updated then leave it alone
        if (oldPet._id != updatedId) return oldPet;
        else return updatedPet;
      })

      this.setState({pets})
    })
  }

  editPet = (event) => {
    event.preventDefault();

    let name = event.target.getAttribute('data-name');
    let type = event.target.getAttribute('data-type');

    this.setState({
      edit_id : event.target.getAttribute('data-id')
    }, function(){

      let form = document.querySelector('#editForm');

      form.children[0].value = name;
      form.children[1].value = type;

    })


  }

  componentDidMount() {
    return fetch("http://localhost:3001/pets")
    .then((res) => res.json())
      .then(resultingJSON => this.setState({pets : resultingJSON}))
  }

  render() {
    return (
      <div className="App">
        <header>
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload. {this.state.edit_id}
          </p>

          <h1>{ this.state.name }</h1>

          <form onSubmit={this.createPet}>
            <input type="text" name="pet" placeholder="put in a pet name" />
            <input type="text" name="type" placeholder="put in a type" />

            <button>make pet</button>
          </form>

          
          {(this.state.edit_id != "") && <form id="editForm" onSubmit={this.updatePet}>
            <input type="text" name="pet" placeholder="put in a pet name" />
            <input type="text" name="type" placeholder="put in a type" />

            <button>update pet</button>
          </form>}

          {this.state.pets.map((x) =>
            <p key={x._id}> 
              {x.name} | {x.type} <button onClick={this.deletePet} data-id={x._id}>x</button> 
              | <a onClick={this.editPet} href="#" data-id={x._id} data-name={x.name} data-type={x.type}>edit</a>
            </p>
          )}

          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;