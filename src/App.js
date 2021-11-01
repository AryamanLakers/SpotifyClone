import React from "react"
import Login from "./Login"
import "bootstrap/dist/css/bootstrap.min.css"
import Dashboard from "./Dashboard"

const code=new URLSearchParams(window.location.search).get('code')
function App() {
  console.log(code)
  return (
    <div style={{margin:"0"}}className="App">
      {code?<Dashboard code={code} />:<Login />}
    </div>
  );
}

export default App;
