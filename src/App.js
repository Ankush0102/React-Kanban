import { useState } from 'react';
import CreateBoard from './components/createBoard/CreateBoard';
import Login from './components/login/Login';
import { BrowserRouter as Router,Route,Switch } from 'react-router-dom';
import {DndProvider} from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {

  return (
    
      <div className="App">
        <Router>
          <Switch>
            <Route exact path="/" component={Login} />
          <DndProvider backend={HTML5Backend}>
            <Route exact path="/create-board" component={CreateBoard} />
          </DndProvider>
          </Switch>
        </Router>
      </div>
  );
}

export default App;
