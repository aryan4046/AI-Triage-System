import { useState } from "react";
import Auth from "./components/Auth";
import Chatbot from "./pages/Chatbot";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [patient, setPatient] = useState(null);

  return (
    <>
      {!loggedIn ? (
        <Auth
          onSuccess={(user) => {
            setPatient(user);   // 👈 store name, email, contact
            setLoggedIn(true);
          }}
        />
      ) : (
        <Chatbot
          patientName={patient?.name}
          patientEmail={patient?.email}
          patientContact={patient?.contact}   // ✅ NOW PASSED
        />
      )}
    </>
  );
}

export default App;
