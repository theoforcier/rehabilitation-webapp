import { useState } from "react";

function SignupForm({ Signup, ChangePage, error, setError }) {
  // Login details
  const [details, setDetails] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPass: "",
  });

  // Pass details to our login function upon submit event
  const submitHandler = (e) => {
    e.preventDefault();
    // Empty fields
    if (Object.values(details).includes("")) {
      setError("Please fill out every field!");
    }
    // Non matching passwords
    else if (details.password != details.confirmPass) {
      setError("Passwords do not match!");
    }
    else {
      Signup(details);
    }
  };

  const switchForm = (e) => {
    e.preventDefault();

    ChangePage("login", "");
  };

  // Email/username and password fields update state of details
  return (
    <form onSubmit={submitHandler}>
      <div className="form-inner">
        <h2>Create Account</h2>
        {error != "" ? <div className="error">{error}</div> : ""}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            onChange={(e) =>
              setDetails({ ...details, username: e.target.value })
            }
            value={details.username}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            onChange={(e) => setDetails({ ...details, email: e.target.value })}
            value={details.email}
          />
        </div>
        <div className="form-group">
          <label htmlFor="first-name">First Name</label>
          <input
            type="text"
            name="first-name"
            id="first-name"
            onChange={(e) =>
              setDetails({ ...details, firstName: e.target.value })
            }
            value={details.firstName}
          />
        </div>
        <div className="form-group">
          <label htmlFor="last-name">Last Name</label>
          <input
            type="text"
            name="last-name"
            id="last-name"
            onChange={(e) =>
              setDetails({ ...details, lastName: e.target.value })
            }
            value={details.lastName}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={(e) =>
              setDetails({ ...details, password: e.target.value })
            }
            value={details.password}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirm-pass">Confirm Password</label>
          <input
            type="password"
            name="confirm-pass"
            id="confirm-pass"
            onChange={(e) =>
              setDetails({ ...details, confirmPass: e.target.value })
            }
            value={details.confirmPass}
          />
        </div>
        <input type="submit" value="CREATE" />
        <hr className="seperator" />
        <div className="form-redirect">
          <button onClick={switchForm}>Have an account? Sign in here</button>
        </div>
      </div>
    </form>
  );
}

export default SignupForm;
