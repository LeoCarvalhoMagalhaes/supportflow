import { useState } from "react"
import type { SubmitEvent } from "react"
import { useTranslation } from "react-i18next"

import api from "../api/client"
import type { Ticket, TicketPriority } from "../types/ticket"

interface TicketFormProps {
  onTicketCreated: (ticket: Ticket) => void
}

function TicketForm({
  onTicketCreated
}: TicketFormProps) {
  const { t } = useTranslation()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] =
    useState<TicketPriority>("medium")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (
    event: SubmitEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    setError("")
    setLoading(true)

    const token = localStorage.getItem(
      "supportflow_token"
    )

    if (!token) {
      setError(t("auth.login.error"))
      setLoading(false)
      return
    }

    try {
      const response = await api.post<Ticket>(
        "/tickets/",
        {
          title,
          description,
          priority
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      onTicketCreated(response.data)

      setTitle("")
      setDescription("")
      setPriority("medium")
    } catch (error) {
      console.error(
        "Erro ao criar ticket:",
        error
      )

      setError(
        t("tickets.form.error")
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="ticket-form">
      <h3>{t("tickets.form.title")}</h3>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <label htmlFor="ticket-title">
          {t("tickets.form.titleLabel")}
        </label>

        <input
          id="ticket-title"
          type="text"
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
          placeholder={t(
            "tickets.form.titlePlaceholder"
          )}
          minLength={3}
          maxLength={150}
          required
        />

        <label htmlFor="ticket-description">
          {t("tickets.form.descriptionLabel")}
        </label>

        <textarea
          id="ticket-description"
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          placeholder={t(
            "tickets.form.descriptionPlaceholder"
          )}
          minLength={5}
          required
        />

        <label htmlFor="ticket-priority">
          {t("tickets.form.priorityLabel")}
        </label>

        <select
          id="ticket-priority"
          value={priority}
          onChange={(event) =>
            setPriority(
              event.target.value as TicketPriority
            )
          }
        >
          <option value="low">
            {t("tickets.priority.low")}
          </option>

          <option value="medium">
            {t("tickets.priority.medium")}
          </option>

          <option value="high">
            {t("tickets.priority.high")}
          </option>
        </select>

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? t("tickets.form.loading")
            : t("tickets.form.submit")}
        </button>
      </form>
    </section>
  )
}

export default TicketForm