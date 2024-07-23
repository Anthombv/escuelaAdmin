import { ThemeProvider } from "styled-components";
import "devextreme/dist/css/dx.light.css";
import "react-toastify/dist/ReactToastify.css";
import GlobalStyle from "../lib/styles/global";
import theme from "../lib/styles/theme";
import { useLocalStorage } from "../lib/hooks/use_local_storage";
import { useEffect, useMemo, useState } from "react";
import AuthContext from "../lib/contexts/auth_context";
import { AuthContextProps, User } from "../backend/types";
import SessionLayout from "../lib/layouts/session_layout";
import { ToastContainer } from "../lib/components/toastify";
import { useNoScroll } from "../lib/hooks/use_no_scroll";
import "../styles/global.css";

// configuracion general de la app
export default function App({ Component, pageProps }) {
  // hook para obtener los datos de usuario en el local storage
  const { storedValue, setValue, removeValue } = useLocalStorage("userData");
  // estado del usuario en la app
  const [auth, setAuth] = useState(null);

  useNoScroll().set();

  // revisa y configura si hay un usuario guardado
  useEffect(() => {
    (() => {
      storedValue &&
        setAuth({ ...storedValue, role: parseInt(storedValue.role) });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // permite iniciar sesion
  const login = (userData: User) => {
    setValue(userData);
    setAuth(userData);
  };

  // permite cerrar sesion
  const logout = () => {
    if (auth) {
      setAuth(null);
      removeValue();
    }
  };

  // guarda y actualiza las variables del contexto
  const authData = useMemo<AuthContextProps>(
    () => ({ auth, login, logout }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [auth]
  );

  return (
    // provee de variables de context
    <AuthContext.Provider value={authData}>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
      {/* muestra alertas */}
      <ToastContainer />
      <SessionLayout>
        {/* ruta actual renderizada */}
        <Component {...pageProps} />
      </SessionLayout>
      </ThemeProvider>
    </AuthContext.Provider>
  );
}
