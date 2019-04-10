import axios from 'axios';
import React, { Component } from 'react';
import SelectMovie from './components/SelectMovie';
import Header from './components/Table/Header';
import TBody from './components/Table/TBody';
import Crawl from './components/Crawl';
import Star from './components/Star';

const domain = `https://swapi.co/api/films`;

class App extends Component {
  state = {
    movieResults: [], CurrentFilm: "", index: "",
    movie_list: [], Mylist: [],
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
    if (this.state.Mylist[index] === undefined) {
      this.setState({ CurrentFilm: movie.opening_crawl, loading: true, index });

      const pArray = (movie.characters).map(async len => {
        const response = await fetch(`${len}`);
        return response.json();
      });

      const users = await Promise.all(pArray);
      const mySets = new Set();
      users.forEach((id) => { mySets.add(id.gender) });
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
        loading: false,
        genderFilter: "default"
      }));

    } else {
      this.setState({ index, genderFilter: "default" });
    }

  }

  onSort(event, sortKey) {
    const data = this.state.Mylist[this.state.index];
    const { heightSort, nameSort } = this.state;

    if (sortKey === "name" || sortKey === "gender") {
      data.sort((a, b) => (nameSort ? ((a[sortKey]).localeCompare(b[sortKey])) : ((b[sortKey]).localeCompare(a[sortKey]))));
      this.setState(prevState => ({ nameSort: !prevState.nameSort }));

    } else if (sortKey === "height") {
      data.sort((a, b) => (heightSort ? ((a.height) - (b.height)) : ((b.height) - (a.height))));
      this.setState(prevState => ({ heightSort: !prevState.heightSort }));
    }

    this.setState({ data })

  }

  HandleGender(e) {
    this.setState({ genderFilter: e.target.value });
  }

  render() {
    const { CurrentFilm, index, loading, error, Mylist, genderFilter, Genders } = this.state;
    const data = Mylist[index] || [];
    const type = genderFilter;
    const blu = (data).filter(key => ((type === "default") ? true : key.gender === type))
                .map(item => (item.height === 'unknown') ? 0 : parseInt(item.height));

    return (
      <div className="App">
        <SelectMovie options={this.state.movie_list} HandleMovies={this.handleSelect.bind(this)} />
        <div className="text-center">
          {CurrentFilm === "" ?
            <Star /> :
            <div>
              <Crawl movietitle={CurrentFilm} key={index}></Crawl>
              <p className="error">{error}</p>
              <div>
                {(loading === true) ?
                  <p className="text-center load">Character list loading...</p>
                  :
                  <table className="table table-bordered w-50 mx-auto" key={this.state.index}>
                    <Header genders={Genders[index]} index={index} sort={this.onSort.bind(this)} HandleGender={this.HandleGender.bind(this)} />
                    <TBody currentList={Mylist[index]} type={type} total={blu.length} sumcm={blu.reduce(((a, b) => a + b), 0)} />
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

export default App;