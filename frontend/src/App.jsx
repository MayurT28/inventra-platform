import { useEffect, useState } from "react";
import API from "./services/api";

function App() {

  const [message, setMessage] = useState("");

  useEffect(() => {

    API.get("/api/health")
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        console.error("Error connecting backend:", error);
      });

  }, []);

  return (
    <div>
      <h1>Inventra Dashboard</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;