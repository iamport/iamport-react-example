import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Home from './Home';
import Payment from './Payment';
import PaymentResult from './PaymentResult';
import Certification from './Certification';
import CertificationResult from './CertificationResult';

function App() {
  return (
    <BrowserRouter>
      <Route exact path="/" component={Home} />
      <Route exact path="/payment" component={Payment} />
      <Route exact path="/payment/result" component={PaymentResult} />
      <Route exact path="/certification" component={Certification} />
      <Route exact path="/certification/result" component={CertificationResult} />
    </BrowserRouter>
  );
}

export default App;
