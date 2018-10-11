import React, {Component} from 'react';

//import {Input, Button} from 'mdbreact';
import { Row, Col } from 'reactstrap';
import NavBar from '../Components/NavBar';
import MyStocks from '../Components/Games/MyStocks';
import Leaderboard from '../Components/Games/Leaderboard';
import CreateGame from '../Components/Games/CreateGame'
import GameList from '../Components/Games/GamesList';
import '../Static/CSS/Games.css';
import axios from 'axios';
import UpdateGame from "../Components/Games/UpdateGame";

class Games extends Component {

  constructor(props) {
    super(props);

    this.state = {
      // Array of user objects for the leaderboard
      users: [],
      // Array of player's stock objects
      myStocks: [],
      // Array of game objects
      myFloors: [],
      // Money the user has
      buying_power: 0,
      // User's uid
      uid: sessionStorage.getItem('uid'),
      // Current game object
      currentGame: {},
      // Current user
      currentUser: {},
      // Array of all the users' information in the current game
      userGame: [],
      // Current users email
      email: "",
      // Check if this is the leader of the game
      leader: false,
    };
  }

  /**
   *
   * Retrieve array of game objects for a user
   *
   */

  componentWillMount () {
    // Make server call for data
    this.fetchGames();
  };

  /**
   * Initial call to data base for all the games
   */
  fetchGames = () => {
    let self = this;
    axios.get(`http://localhost:8080/Portfol.io/Games/By/User/${this.state.uid}`)
      .then(function (response) {
        // handle success
        let gameData = response.data;

        if (gameData.games.length !== 0) {
          // Set up the game data
          self.setGameData(gameData.games);

        } else { // No games return
          // Get the current user's email
          axios.get(`http://localhost:8080/Portfol.io/${self.state.uid}`)
            .then(function (response) {
              // handle success
              let user = response.data;

              self.setState({
                email: user.email,
              })

            }).catch(function (err) {
            console.log("Cannot get users for the current game");

            if (err.response && err.response.data)
              console.log(err.response.data.error);
            else
              console.log(err);
          })
        }
      })
      .catch(function (error) {
        // handle error
        console.log(`Oh no! Our API didn't respond. Please refresh and try again`)
        console.log(`Btw here is the error message\n\n`)

        if (error.response && error.response.data)
          console.log(error.response.data.error);
        else
          console.log(error);
      })
  }

  /**
   * Sets game info for the first time
   */
  setGameData = (games) => {
    let self = this;
      self.setState({
        myFloors: games,
        currentGame: games[0],
      }, () => {
        self.props.updateCurrentGame(games[0]);
        // Call to the server to get all user objects for the current game
        for (let x = 0; x < self.state.currentGame.active_players.length; x++) {
          axios.get(`http://localhost:8080/Portfol.io/${self.state.currentGame.active_players[x]}`)
            .then(function (response) {
              // handle success
              if (response != null) {
                self.processUser(response.data, x);
                self.leaderCheck();
              }

            }).catch(function (err) {
            console.log("Cannot get users for the current game");

            if (err.response && err.response.data)
              console.log(err.response.data.error);
            else
              console.log(err);
          })
        }
      })
  }

  /**
   * Processes each user
   * @param user
   * @param index in array
   */
  processUser = (user, index) => {
    let self = this;
    let newArray = self.state.users;
    newArray[index] = user;

    // Check to see if given user is the current user
    if (self.state.uid === user._id) {
      self.setState({
        email: user.email,
        currentUser: user,
      }, () => {
        // Loop over all the current user's games and set their buying power based on the game
        for (let i = 0; i < user.active_games.length; i++) {
          // Check if game code is equal to the code
          if (self.state.currentGame.code === user.active_games[i].code) {
            self.setState({
              buying_power: user.active_games[i].buying_power,
            })
          }
        }
      })
    }

    // Go through a user's active games and add the current game data to the userGame array
    let ug = self.state.userGame;

    let tmp = null;
    let totalA = 0;
    // Data for the leaderboard is created here
    for (let i = 0; i < user.active_games.length; i++) {
      // Check if game code is equal to the code of the game data
      if (self.state.currentGame.code === user.active_games[i].code) {
        console.log("Made it");
        // Calculate the the total assets here and add to the object
        //for (let j = 0; j < user.active_games[i].stocks.length; j++) {
          //totalA = user.active_games[i].stocks
        //}

        tmp = {
          code: user.active_games[i].code,
          buying_power: user.active_games[i].buying_power,
          trade_count: user.active_games[i].trade_count,
          stocks: user.active_games[i].stocks,
          username: user.username,
          totalAssests: totalA
        }
        break;
      }
    }
    // Make sure tmp is set
    if (tmp != null)
      ug.push(tmp);


    self.setState({
      users: newArray,
      userGame: ug,
    })
  }

  /**
   * Checks if the current user is the leader of a game
   */
  leaderCheck = () => {
    let self = this;
    if (self.state.currentGame != null && self.state.currentGame.leader_email === self.state.email) {
      self.setState({
        leader: true,
      })
    } else {
      self.setState({
        leader: false,
      })
    }
  }

  /**
   * Update the current game state and then add the users when a new game is clicked
   * para index is the index of the new floor from 0 to n
   */
  updateGame = (index) => {
    let self = this;
    if (self.state.myFloors.length !== 0) {
      let newFloor = self.state.myFloors[index];
      self.setState({
          currentGame: newFloor,
          users: [],
          userGame: [],
        }, () => {
          self.leaderCheck();
          self.props.updateCurrentGame(newFloor);

          for (let x = 0; x < self.state.currentGame.active_players.length; x++) {
            axios.get(`http://localhost:8080/Portfol.io/${self.state.currentGame.active_players[x]}`)
              .then(function (response) {
                // handle success
                let user = response.data;
                self.processUser(user, x)

              }).catch(function (err) {
              console.log("Cannot get users for the current game");

              if (err.response && err.response.data)
                console.log(err.response.data.error);
              else
                console.log(err);
            })
          }

        }
      )
    }
  }

  /**
   * Prepares data for the leaderboard component
   */
  prepBoard = () => {

  }

  /**
   * Sorts the users based on total assets
   * array.sort(sortRank());
   */
  sortRank = () => {
    return function(a, b) {
      return a.totalAssets - b.totalAssets;
    };
  }

  /**
   * Reload the page
   */
  reloadPage = () => {
    window.location.reload();
  }

  render() {
    return (
      <div>
        <div className='navbar-fixed'>
          <NavBar/>
        </div>
        <Row style={{paddingTop: '10em'}} className='blackBackground body_div'>
          <Col md="4"/>

          {this.state.currentGame != null && this.state.currentGame.game_name
            ?
            <Col md="5">
              <h5 id="floorName" className={"gamesText "}>Floor Name : {this.state.currentGame.game_name}</h5>
            </Col>
            :
            <Col md="5"/>
          }
        </Row>
        <Row style={{paddingTop: '2em'}} className='blackBackground body_div'>
          <Col>
            <Row>
              <Col md="1"/>

              {this.state.leader
                ?
                <Col md="2">
                  <h5 className={"gamesText "}>Floor Code : {this.state.currentGame.code}</h5>
                </Col>
                :
                <Col md="2"/>
              }
              <Col md="6"/>
              <Col md="3">
                <h5 className={"gamesText"}>Buying Power : ${this.state.buying_power}</h5>
              </Col>
            </Row>
            {this.state.leader
              ? <Row>
                <Col md="1"/>
                <Col md="1">
                  <UpdateGame currentGame={this.state.currentGame}/>
                </Col>
                <Col md="10"/>
              </Row>
              : <Row/>
            }
            <Row  style={{paddingTop: '4em'}} >
              <Col md='9'>
                <Row>
                <Col md='1'/>
                <Col md='5'>
                  <Leaderboard currentGame={this.state.currentGame} userGame={this.state.userGame}/>
                </Col>

                <Col md='5'>
                  <MyStocks/>
                </Col>
                  <Col md='1'/>
                </Row>
              </Col>

              <Col md='2' className='blackBackground body_div'>
                <GameList updateGame={this.updateGame} myFloors={this.state.myFloors}/>
                <CreateGame reloadPage={this.reloadPage} email={this.state.email} uid={this.state.uid}/>
              </Col>
              <Col md='1'/>
            </Row>

          </Col>

        </Row>

      </div>
    );
  }
}

export default Games;
