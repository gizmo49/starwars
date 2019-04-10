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
    CharacterList: [], movie_list: [],
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

  handleSelect = (value) => {
    let index = value.value;
    let movie = this.state.movieResults[index];
    this.setState({ CurrentFilm: movie.opening_crawl, CharacterList: [], loading: "Character List loading...", index });

    (movie.characters).map((len) =>
      axios.get(len).then((res) => {
        let char = res.data;
        let gender = ((char.gender === "male" || char.gender === "female") ? (char.gender === "male" ? "M" : "F") : "-");
        this.setState(prevState => ({
          CharacterList: [...prevState.CharacterList, { name: char.name, gender, height: char.height }]
        }))

      }).catch((err) => this.setState({ loading: "Something Went Wrong" }))
    );

  }

  onSort = (event, sortKey) => {
    const data = this.state.CharacterList;
    const { heightSort, nameSort } = this.state;

    if (sortKey === "name") {
      data.sort((a, b) => (nameSort ? ((a[sortKey]).localeCompare(b[sortKey])) : ((b[sortKey]).localeCompare(a[sortKey]))));
      this.setState(prevState => ({ nameSort: !prevState.nameSort }));

    } else if (sortKey === "height") {
      data.sort((a, b) => (heightSort ? ((a.height) - (b.height)) : ((b.height) - (a.height))));
      this.setState(prevState => ({ heightSort: !prevState.heightSort }));
    }
    this.setState({ data })

  }

  HandleGender = (e) => this.setState({ genderFilter: e.target.value });

  render() {
    const { CurrentFilm, index, loading, CharacterList } = this.state;
    const data = this.state.CharacterList;
    const type = this.state.genderFilter;
    const blu = (data).filter(key => (type === 'M' || type === 'F') ? (key.gender === type) : true)
      .map(item => parseInt(item.height));

    return (
      <div className="App">
        <div className="w-50 mx-auto my-3">
          <Select name="movie_list"
            isSearchable={false}
            noOptionsMessage={() => "Loading..."}
            options={this.state.movie_list}
            onChange={this.handleSelect} />
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
              <div>
                {(loading !== "" && (CharacterList).length <= 0) ?
                  <p className="text-center load">{loading}</p>
                  :
                  <table className="table table-bordered w-50 mx-auto">
                    <thead>
                      <tr>
                        <th scope="col"></th>
                        <th scope="col">
                          <select onChange={this.HandleGender.bind(this)}>
                            <option value="default">all gender</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                          </select>
                        </th>
                        <th scope="col"></th>
                      </tr>
                      <tr>
                        <th scope="col" onClick={e => this.onSort(e, 'name')}>Name</th>
                        <th scope="col">Gender</th>
                        <th scope="col" onClick={e => this.onSort(e, 'height')}>Height(CM)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        Object.keys(data)
                          .filter(key => (type === 'M' || type === 'F') ? (data[key].gender === type) : true)
                          .map((key, index) =>
                            <tr key={index}>
                              <td>{data[key].name}</td>
                              <td>{data[key].gender}</td>
                              <td>{data[key].height}</td>
                            </tr>
                          )
                      }
                      <tr>
                        <td colSpan="2">Total: {blu.length}</td>
                        <td>{blu.reduce((a, b) => a + b)}cm {toFeet(blu.reduce((a, b) => a + b))}</td>
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
