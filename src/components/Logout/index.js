import { googleLogout } from "@react-oauth/google";

const clientId = "818623730310-suqadla5gshddsh7iipagqihufgrq8s9.apps.googleusercontent.com";

function Logout() {
  const onSuccess = () => {
    console.log("Logout successful!");
  };

  const handleLogout = () => {
    googleLogout(); // Trigger the logout process
    onSuccess(); // Call success callback after logout
  };

  return (
    <div id="signOutButton">
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Logout;
