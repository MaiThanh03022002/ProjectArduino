
import React from 'react'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Main from './Main';
import Sensor from './Sensor';
import Profile from './Profile';
import Action from './Action';
function App() {
  return (
  <Router>
    <div className="App">
      <Routes>
        <Route path='/' element={<Main></Main>}></Route>
        <Route path='/sensor' element={<Sensor></Sensor>}></Route>
        <Route path='/profile' element={<Profile></Profile>}></Route>
        <Route path='/action' element={<Action></Action>}></Route>
      </Routes>
    </div>
  </Router>
  );
}

export default App;
