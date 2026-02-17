import { useState } from "react";
import Auth from "./components/Auth";
import Chatbot from "./pages/Chatbot";

function App() {
  const [user, setUser] = useState(null);

  return (
    <>
      {!user ? (
        <Auth onSuccess={setUser} />
      ) : (
        <Chatbot
          patientName={user.name}
          patientEmail={user.email}
          patientContact={user.contact}
          userId={user.user_id}   // 🔥 VERY IMPORTANT
        />
      )}
    </>
  );
}

export default App;
