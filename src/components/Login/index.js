import { GoogleLogin } from "@react-oauth/google";
const clientId = "818623730310-suqadla5gshddsh7iipagqihufgrq8s9.apps.googleusercontent.com"

function Login() {
    const onSuccess = (res) => {
        console.log("Login Success! current user", res.profileObj);
    }
    const onFailure = (res) => {
        console.log("Login FAILED! res: ", res);
    }
    return (
        <div id="signInButton">
            <GoogleLogin
                clientId={clientId}
                buttonText="Login"
                onSuccess={onSuccess}
                onFailure={onFailure}
                isSignedIn={true} />
        </div>
    )
}
export default Login