import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Home from './Home';
import Payment from './Payment';
import Certification from './Certification';

function App() {
  return (
    <BrowserRouter>
      <Route exact path="/" component={Home} />
      <Route exact path="/payment" component={Payment} />
      <Route exact path="/certification" component={Certification} />
    </BrowserRouter>
  );
}

export default App;
