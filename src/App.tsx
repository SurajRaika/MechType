import { GeistProvider, CssBaseline } from '@geist-ui/core'

import AppComponent from "./AppComponent";

function App() {
  return (
    <GeistProvider>
    <CssBaseline /> 
    <AppComponent /> 
  </GeistProvider>
  );
}

export default App;
