import { createContext, useEffect, useReducer } from "react";
import axios from "axios";
// CUSTOM COMPONENT
import { MatxLoading } from "app/components";
import Swal from "sweetalert2";
const initialState = {
  user: null,
  isInitialized: false,
  isAuthenticated: false
};
function decodeJwt(token) {
  const parts = token.split(".");
  const header = JSON.parse(atob(parts[0]));
  const payload = JSON.parse(atob(parts[1]));
  const signature = parts[2];

  return {
    header,
    payload,
    signature
  };
}
const reducer = (state, action) => {
  switch (action.type) {
    case "INIT": {
      const { isAuthenticated, user } = action.payload;
      return { ...state, isAuthenticated, isInitialized: true, user };
    }

    case "LOGIN": {
      return { ...state, isAuthenticated: true, user: action.payload.user };
    }

    case "LOGOUT": {
      return { ...state, isAuthenticated: false, user: null };
    }

    default:
      return state;
  }
};

const AuthContext = createContext({
  ...initialState,
  method: "JWT",
  login: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const login = async (email, password) => {
    try {
      const response = await axios.post("https://ftai-api.monoinfinity.net/api/auth/login", {
        email,
        password
      });

      const token = response.data.data.accessToken;
      const decoded = decodeJwt(token);
      const userID = decoded.payload.UserId;
      const secondRes = await axios.get(
        `https://ftai-api.monoinfinity.net/api/user/profile/${userID}`
      );
      const user = secondRes.data.data;

      if (user.roleId !== 1) {
        console.log(user.roleId);
        if (user.roleId === 2) {
          //staff login
          dispatch({ type: "LOGIN", payload: { user } });
          return "/shop/orders";
        } else if (user.roleId === 3) {
          //manager login
          dispatch({ type: "LOGIN", payload: { user } });
          return "/dashboard/default";
        } else if (user.roleId === 4) {
          //manager login
          dispatch({ type: "LOGIN", payload: { user } });
          return "/users/user";
        }
      } else {
        Swal.fire("Error!", "Login attempt for admin user denied.", "error");
      }
    } catch (error) {
      Swal.fire("Error!", "Wrong credentials", "error");
    }
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("/api/auth/profile");
        dispatch({ type: "INIT", payload: { isAuthenticated: true, user: data.user } });
      } catch (err) {
        console.error(err);
        dispatch({ type: "INIT", payload: { isAuthenticated: false, user: null } });
      }
    })();
  }, []);

  // SHOW LOADER
  if (!state.isInitialized) return <MatxLoading />;

  return (
    <AuthContext.Provider value={{ ...state, method: "JWT", login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
