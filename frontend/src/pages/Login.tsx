import { useState } from "react"
import type { SubmitEvent } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

import api from "../api/client"


function Login() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)


  const handleSubmit = async (
    event: SubmitEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    setError("")
    setLoading(true)

    try {
      const formData = new URLSearchParams()

      formData.append(
        "username",
        email
      )

      formData.append(
        "password",
        password
      )

      const response = await api.post(
        "/auth/login",
        formData,
        {
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded"
          }
        }
      )

      const { access_token } =
        response.data

      localStorage.setItem(
        "supportflow_token",
        access_token
      )

      navigate("/dashboard")

    } catch (error) {
      console.error(
        "Erro ao realizar login:",
        error
      )

      setError(
        t("auth.login.error")
      )

    } finally {
      setLoading(false)
    }
  }


  return (
    <main className="auth-container">

      <div className="auth-card">

        <h1>
          {t("app.name")}
        </h1>

        <h2>
          {t("auth.login.title")}
        </h2>

        <p>
          {t("auth.login.description")}
        </p>


        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}


        <form onSubmit={handleSubmit}>

          <label htmlFor="email">
            {t("auth.login.email")}
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(
                event.target.value
              )
            }
            placeholder="email@example.com"
            required
          />


          <label htmlFor="password">
            {t("auth.login.password")}
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(
                event.target.value
              )
            }
            placeholder="••••••••"
            required
          />


          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? t("auth.login.loading")
              : t("auth.login.submit")}
          </button>

        </form>


        <div className="auth-link">

          <span>
            {t("auth.login.noAccount")}
          </span>

          <button
            type="button"
            onClick={() =>
              navigate("/register")
            }
          >
            {t("auth.login.register")}
          </button>

        </div>

      </div>

    </main>
  )
}

export default Login