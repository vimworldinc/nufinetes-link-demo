import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Loadable from 'react-loadable'
import Index from "../views/Index";
import Dapp from "../views/Dapp";
import EthSign from "../views/EthSign";
import Contract from "../views/Contract";
import Vechain from "../views/Vechain";

export default () => {
  return (
    <Suspense fallback={<>loading</>}>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dapp" element={<Dapp />} />
          <Route path="/eth-sign" element={<EthSign />} />
          <Route path="/contract" element={<Contract />} />
          <Route path="/vechain" element={<Vechain />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
};
