import { useState } from "react";
import Auth from "./components/Auth";
import Chatbot from "./pages/Chatbot";

function App() {
  const [user, setUser] = useState(null);

  const handleAuthSuccess = (userData) => {
    // 🔥 VERY IMPORTANT
    setUser({
      name: userData.name,
      email: userData.email,
      contact: userData.contact,
      userId: userData.userId
    });
  };

  return (
    <>
      {!user ? (
        <Auth onSuccess={handleAuthSuccess} />
      ) : (
        <Chatbot
          patientName={user.name}
          patientEmail={user.email}
          patientContact={user.contact}
          userId={user.userId}
        />
      )}
    </>
  );
}

export default App;
