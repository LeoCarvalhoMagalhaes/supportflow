import { useState } from "react"
import type { SubmitEvent } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

import api from "../api/client"


function Register() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)


  const handleSubmit = async (
    event: SubmitEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    setError("")
    setSuccess("")
    setLoading(true)

    try {
      await api.post(
        "/auth/register",
        {
          name,
          email,
          password
        }
      )

      setSuccess(
        t("auth.register.success")
      )

      setName("")
      setEmail("")
      setPassword("")

      setTimeout(() => {
        navigate("/login")
      }, 1500)

    } catch (error) {
      console.error(
        "Erro ao criar conta:",
        error
      )

      setError(
        t("auth.register.error")
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
          {t("auth.register.title")}
        </h2>

        <p>
          {t("auth.register.description")}
        </p>


        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}


        {success && (
          <div className="auth-success">
            {success}
          </div>
        )}


        <form onSubmit={handleSubmit}>

          <label htmlFor="register-name">
            {t("auth.register.name")}
          </label>

          <input
            id="register-name"
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder={t(
              "auth.register.namePlaceholder"
            )}
            minLength={2}
            maxLength={100}
            required
          />


          <label htmlFor="register-email">
            {t("auth.register.email")}
          </label>

          <input
            id="register-email"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="email@example.com"
            required
          />


          <label htmlFor="register-password">
            {t("auth.register.password")}
          </label>

          <input
            id="register-password"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="••••••••"
            minLength={8}
            maxLength={100}
            required
          />


          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? t("auth.register.loading")
              : t("auth.register.submit")}
          </button>

        </form>


        <div className="auth-link">
          <span>
            {t("auth.register.haveAccount")}
          </span>

          <button
            type="button"
            onClick={() =>
              navigate("/login")
            }
          >
            {t("auth.register.login")}
          </button>
        </div>

      </div>
    </main>
  )
}

export default Register