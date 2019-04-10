import React, { Component } from 'react';
import Select from 'react-select';
import axios from 'axios';

const domain = `https://swapi.co/api/films`;

function toFeet(n) {
  var realFeet = ((n * 0.393700) / 12);
  var feet = Math.floor(realFeet);
  var inches = Math.round((realFeet - feet) * 12);
  return feet + "ft / " + inches + 'in';
}

export default class App extends Component {

  state = {
    movieResults: [], CurrentFilm: "", index: "",
    movie_list: [], Mylist:[],
    loading: false, heightSort: true, nameSort: true, genderFilter: "default"
  }

  componentWillMount = () => {
    axios.get(domain).then(res => {
      let movieResults = res.data.results;
      let movie_list = [];
      movieResults.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
      movieResults.forEach((sky, i) => movie_list.push({ value: i, label: sky.title }));
      this.setState({ movieResults, movie_list });

    }).catch((err) => console.log(`An error occured ${err}`));

  }


  async handleSelect(value) {
    let index = value.value;
    let movie = this.state.movieResults[index];
    if(this.state.Mylist[index] === undefined){
      this.setState({ CurrentFilm: movie.opening_crawl, loading: true, index });
      
      const pArray = (movie.characters).map( async len => {
        const response = await fetch(`${len}`);
        return response.json();
      });
      
      const users = await Promise.all(pArray);
      const mySets = new Set(); 
      users.forEach((id) => {  mySets.add(id.gender)  });
      this.setState(prevState => ({
          ...prevState,
          Mylist: {
              ...prevState.Mylist,
              [index]: users
          },
          Genders: {
            ...prevState.Genders,
            [index]: [...mySets]
          },
          loading:false,
          genderFilter:"default"
        }));
      
    }else{
      this.setState({index, genderFilter:"default"});
    }

  }

  onSort(event, sortKey){
    const data = this.state.Mylist[this.state.index];
    const { heightSort, nameSort } = this.state;

    if (sortKey === "name"  || sortKey === "gender") {
      data.sort((a, b) => (nameSort ? ((a[sortKey]).localeCompare(b[sortKey])) : ((b[sortKey]).localeCompare(a[sortKey]))));
      this.setState(prevState => ({ nameSort: !prevState.nameSort }));

    } else if (sortKey === "height") {
      data.sort((a, b) => (heightSort ? ((a.height) - (b.height)) : ((b.height) - (a.height))));
      this.setState(prevState => ({ heightSort: !prevState.heightSort }));
    }

    this.setState({ data })

  }

  HandleGender(e){
    this.setState({ genderFilter: e.target.value });
  }

  render() {
    const { CurrentFilm, index, loading, error} = this.state;
    const data = this.state.Mylist[this.state.index] || [];
    const type = this.state.genderFilter;
    const blu = (data).filter(key => ((type === "default") ? true : key.gender === type) )
      .map(item => parseInt(item.height));

    return (
      <div className="App">
        <div className="w-50 mx-auto my-3">
          <Select name="movie_list"
            isSearchable={false}
            noOptionsMessage={() => "Loading..."}
            options={this.state.movie_list}
            onChange={this.handleSelect.bind(this)} />
        </div>

        <div className="text-center">
          {CurrentFilm === "" ?
            <div className="my-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Star_Wars_Logo.svg/320px-Star_Wars_Logo.svg.png"
                style={{ "maxWidth": "100%" }}
                alt="StarWars" />
            </div>
            :
            <div>
              <div className="marquee mx-auto my-2" key={index}>
                <p>{CurrentFilm}</p>
              </div>
              <p className="error">{error}</p>
              <div>
                {(loading === true) ?
                  <p className="text-center load">Character list loading...</p>
                  :
                  <table className="table table-bordered w-50 mx-auto" key={this.state.index}>
                    <thead>
                      <tr>
                        <th scope="col"></th>
                        <th scope="col">
                          <select onChange={this.HandleGender.bind(this)}>
                            <option value="default">default</option>
                            {
                              (this.state.Genders[this.state.index]).map((kili) => 
                                <option key={kili}>{kili}</option>
                              )
                            }
                          </select>
                        </th>
                        <th scope="col"></th>
                      </tr>
                      <tr>
                        <th scope="col" onClick={e => this.onSort(e, 'name')} className="clk-rl">Name</th>
                        <th scope="col" onClick={e => this.onSort(e, 'gender')} className="clk-rl">Gender</th>
                        <th scope="col" onClick={e => this.onSort(e, 'height')} className="clk-rl">Height(CM)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        (this.state.Mylist[this.state.index] !== undefined) ?
                        (this.state.Mylist[this.state.index])
                          .filter(key => ((type === "default") ? true : key.gender === type) )
                          .map((key, ix) =>
                            <tr key={ix}>
                              <td>{key.name}</td>
                              <td>{key.gender}</td>
                              <td>{key.height}</td>
                            </tr>
                          )
                          :
                          <p>No records</p>
                      }
                      
                      <tr>
                        <td colSpan="2">Total: {blu.length}</td>
                        <td>{blu.reduce(((a, b) => a + b),0)}cm {toFeet( blu.reduce(((a, b) => a + b),0) )}</td>
                      </tr>
                    </tbody>
                  </table>
                }
              </div>
            </div>
          }

        </div>
      </div>
    );
  }
}