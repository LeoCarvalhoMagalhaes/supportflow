import { useEffect } from "react"
import {
  BrowserRouter,
  Route,
  Routes,
  useNavigate
} from "react-router-dom"

import { useTranslation } from "react-i18next"

import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import ProtectedRoute from "./components/ProtectedRoute"
import PublicRoute from "./components/PublicRoute"


function Home() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const token = localStorage.getItem(
    "supportflow_token"
  )

  useEffect(() => {
    if (token) {
      navigate("/dashboard")
    }
  }, [token, navigate])

  return (
    <main>
      <h2>
        {t("home.welcome")}
      </h2>

      <p>
        {t("home.description")}
      </p>

      <button
        onClick={() =>
          navigate("/login")
        }
      >
        {t("home.login")}
      </button>
    </main>
  )
}


function App() {
  const { t, i18n } = useTranslation()

  const changeLanguage = async (
    language: "pt" | "en"
  ) => {
    await i18n.changeLanguage(language)

    localStorage.setItem(
      "supportflow_language",
      language
    )
  }

  return (
    <BrowserRouter>

      <header>

        <div>
          <h1>
            {t("app.name")}
          </h1>

          <p>
            {t("app.description")}
          </p>
        </div>


        <div>

          <button
            onClick={() =>
              changeLanguage("pt")
            }
          >
            PT
          </button>

          <button
            onClick={() =>
              changeLanguage("en")
            }
          >
            EN
          </button>

        </div>

      </header>


      <Routes>

        <Route
          path="/"
          element={<Home />}
        />


        {/* ROTAS PÚBLICAS */}

        <Route element={<PublicRoute />}>

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

        </Route>


        {/* ROTAS PROTEGIDAS */}

        <Route element={<ProtectedRoute />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  )
}

export default App