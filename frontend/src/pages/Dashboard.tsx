import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

import api from "../api/client"
import TicketForm from "../components/TicketForm"
import type {
  Ticket,
  TicketPriority,
  TicketStatus
} from "../types/ticket"


function Dashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

  const [editingTicketId, setEditingTicketId] =
    useState<number | null>(null)

  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] =
    useState("")

  const [editPriority, setEditPriority] =
    useState<TicketPriority>("medium")

  const [editLoading, setEditLoading] =
    useState(false)

  const [editError, setEditError] =
    useState("")

  const [deletingTicketId, setDeletingTicketId] =
    useState<number | null>(null)

  const [statusFilter, setStatusFilter] =
    useState<TicketStatus | "all">("all")

  const [priorityFilter, setPriorityFilter] =
    useState<TicketPriority | "all">("all")


  useEffect(() => {
    const loadTickets = async () => {
      try {
        const response = await api.get<Ticket[]>(
          "/tickets/"
        )

        setTickets(response.data)

      } catch (error) {
        console.error(
          "Erro ao carregar tickets:",
          error
        )

        navigate("/login")

      } finally {
        setLoading(false)
      }
    }

    loadTickets()
  }, [navigate])


  const handleTicketCreated = (
    ticket: Ticket
  ) => {
    setTickets((currentTickets) => [
      ticket,
      ...currentTickets
    ])
  }


  const handleStatusChange = async (
    ticketId: number,
    status: TicketStatus
  ) => {
    try {
      const response = await api.patch<Ticket>(
        `/tickets/${ticketId}/status`,
        {
          status
        }
      )

      setTickets((currentTickets) =>
        currentTickets.map((ticket) =>
          ticket.id === ticketId
            ? response.data
            : ticket
        )
      )

    } catch (error) {
      console.error(
        "Erro ao atualizar status:",
        error
      )
    }
  }


  const startEditing = (
    ticket: Ticket
  ) => {
    setEditingTicketId(ticket.id)

    setEditTitle(ticket.title)
    setEditDescription(ticket.description)
    setEditPriority(ticket.priority)

    setEditError("")
  }


  const cancelEditing = () => {
    setEditingTicketId(null)

    setEditTitle("")
    setEditDescription("")
    setEditPriority("medium")

    setEditError("")
  }


  const handleTicketUpdate = async (
    ticketId: number
  ) => {
    setEditError("")
    setEditLoading(true)

    try {
      const response = await api.put<Ticket>(
        `/tickets/${ticketId}`,
        {
          title: editTitle,
          description: editDescription,
          priority: editPriority
        }
      )

      setTickets((currentTickets) =>
        currentTickets.map((ticket) =>
          ticket.id === ticketId
            ? response.data
            : ticket
        )
      )

      cancelEditing()

    } catch (error) {
      console.error(
        "Erro ao atualizar ticket:",
        error
      )

      setEditError(
        t("tickets.edit.error")
      )

    } finally {
      setEditLoading(false)
    }
  }


  const handleDeleteTicket = async (
    ticketId: number
  ) => {
    const confirmed = window.confirm(
      t("tickets.delete.confirm")
    )

    if (!confirmed) {
      return
    }

    setDeletingTicketId(ticketId)

    try {
      await api.delete(
        `/tickets/${ticketId}`
      )

      setTickets((currentTickets) =>
        currentTickets.filter(
          (ticket) => ticket.id !== ticketId
        )
      )

    } catch (error) {
      console.error(
        "Erro ao excluir ticket:",
        error
      )

    } finally {
      setDeletingTicketId(null)
    }
  }


  const handleLogout = () => {
    localStorage.removeItem(
      "supportflow_token"
    )

    navigate("/login")
  }


  const totalTickets = tickets.length

  const openTickets = tickets.filter(
    (ticket) => ticket.status === "open"
  ).length

  const inProgressTickets = tickets.filter(
    (ticket) =>
      ticket.status === "in_progress"
  ).length

  const completedTickets = tickets.filter(
    (ticket) =>
      ticket.status === "completed"
  ).length


  const filteredTickets = tickets.filter(
    (ticket) => {
      const matchesStatus =
        statusFilter === "all" ||
        ticket.status === statusFilter

      const matchesPriority =
        priorityFilter === "all" ||
        ticket.priority === priorityFilter

      return (
        matchesStatus &&
        matchesPriority
      )
    }
  )


  return (
    <main className="dashboard-container">

      <div className="dashboard-header">

        <div>
          <h2>
            {t("dashboard.title")}
          </h2>

          <p>
            {t("dashboard.description")}
          </p>
        </div>


        <button onClick={handleLogout}>
          {t("dashboard.logout")}
        </button>

      </div>


      <section className="dashboard-stats">

        <div className="stat-card">
          <span>
            {t("dashboard.stats.total")}
          </span>

          <strong>
            {totalTickets}
          </strong>
        </div>


        <div className="stat-card">
          <span>
            {t("dashboard.stats.open")}
          </span>

          <strong>
            {openTickets}
          </strong>
        </div>


        <div className="stat-card">
          <span>
            {t(
              "dashboard.stats.inProgress"
            )}
          </span>

          <strong>
            {inProgressTickets}
          </strong>
        </div>


        <div className="stat-card">
          <span>
            {t(
              "dashboard.stats.completed"
            )}
          </span>

          <strong>
            {completedTickets}
          </strong>
        </div>

      </section>


      <TicketForm
        onTicketCreated={
          handleTicketCreated
        }
      />


      <section className="ticket-filters">

        <div>

          <label htmlFor="status-filter">
            {t("tickets.filters.status")}
          </label>

          <select
            id="status-filter"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as
                  | TicketStatus
                  | "all"
              )
            }
          >

            <option value="all">
              {t("tickets.filters.all")}
            </option>

            <option value="open">
              {t("tickets.status.open")}
            </option>

            <option value="in_progress">
              {t(
                "tickets.status.in_progress"
              )}
            </option>

            <option value="completed">
              {t(
                "tickets.status.completed"
              )}
            </option>

          </select>

        </div>


        <div>

          <label htmlFor="priority-filter">
            {t("tickets.filters.priority")}
          </label>

          <select
            id="priority-filter"
            value={priorityFilter}
            onChange={(event) =>
              setPriorityFilter(
                event.target.value as
                  | TicketPriority
                  | "all"
              )
            }
          >

            <option value="all">
              {t("tickets.filters.all")}
            </option>

            <option value="low">
              {t(
                "tickets.priority.low"
              )}
            </option>

            <option value="medium">
              {t(
                "tickets.priority.medium"
              )}
            </option>

            <option value="high">
              {t(
                "tickets.priority.high"
              )}
            </option>

          </select>

        </div>

      </section>


      {loading ? (

        <p>
          {t("dashboard.loading")}
        </p>

      ) : filteredTickets.length === 0 ? (

        <div className="empty-state">

          <h3>
            {t(
              "dashboard.empty.title"
            )}
          </h3>

          <p>
            {t(
              "dashboard.empty.description"
            )}
          </p>

        </div>

      ) : (

        <div className="ticket-list">

          {filteredTickets.map((ticket) => (

            <article
              className="ticket-card"
              key={ticket.id}
            >

              {editingTicketId ===
              ticket.id ? (

                <div className="ticket-edit-form">

                  <h3>
                    {t(
                      "tickets.edit.title"
                    )}
                  </h3>


                  {editError && (
                    <div className="auth-error">
                      {editError}
                    </div>
                  )}


                  <label
                    htmlFor={`edit-title-${ticket.id}`}
                  >
                    {t(
                      "tickets.form.titleLabel"
                    )}
                  </label>


                  <input
                    id={`edit-title-${ticket.id}`}
                    type="text"
                    value={editTitle}
                    onChange={(event) =>
                      setEditTitle(
                        event.target.value
                      )
                    }
                    minLength={3}
                    maxLength={150}
                    required
                  />


                  <label
                    htmlFor={`edit-description-${ticket.id}`}
                  >
                    {t(
                      "tickets.form.descriptionLabel"
                    )}
                  </label>


                  <textarea
                    id={`edit-description-${ticket.id}`}
                    value={editDescription}
                    onChange={(event) =>
                      setEditDescription(
                        event.target.value
                      )
                    }
                    minLength={5}
                    required
                  />


                  <label
                    htmlFor={`edit-priority-${ticket.id}`}
                  >
                    {t(
                      "tickets.form.priorityLabel"
                    )}
                  </label>


                  <select
                    id={`edit-priority-${ticket.id}`}
                    value={editPriority}
                    onChange={(event) =>
                      setEditPriority(
                        event.target
                          .value as TicketPriority
                      )
                    }
                  >

                    <option value="low">
                      {t(
                        "tickets.priority.low"
                      )}
                    </option>

                    <option value="medium">
                      {t(
                        "tickets.priority.medium"
                      )}
                    </option>

                    <option value="high">
                      {t(
                        "tickets.priority.high"
                      )}
                    </option>

                  </select>


                  <div className="ticket-actions">

                    <button
                      type="button"
                      onClick={() =>
                        handleTicketUpdate(
                          ticket.id
                        )
                      }
                      disabled={editLoading}
                    >
                      {editLoading
                        ? t(
                            "tickets.edit.saving"
                          )
                        : t(
                            "tickets.edit.save"
                          )}
                    </button>


                    <button
                      type="button"
                      onClick={cancelEditing}
                      disabled={editLoading}
                    >
                      {t(
                        "tickets.edit.cancel"
                      )}
                    </button>

                  </div>

                </div>

              ) : (

                <>

                  <h3>
                    {ticket.title}
                  </h3>


                  <p>
                    {ticket.description}
                  </p>


                  <div className="ticket-info">

                    <span>
                      {t(
                        `tickets.priority.${ticket.priority}`
                      )}
                    </span>


                    <select
                      value={ticket.status}
                      onChange={(event) =>
                        handleStatusChange(
                          ticket.id,
                          event.target
                            .value as TicketStatus
                        )
                      }
                    >

                      <option value="open">
                        {t(
                          "tickets.status.open"
                        )}
                      </option>


                      <option value="in_progress">
                        {t(
                          "tickets.status.in_progress"
                        )}
                      </option>


                      <option value="completed">
                        {t(
                          "tickets.status.completed"
                        )}
                      </option>

                    </select>

                  </div>


                  <div className="ticket-actions">

                    <button
                      type="button"
                      onClick={() =>
                        startEditing(ticket)
                      }
                    >
                      {t(
                        "tickets.edit.button"
                      )}
                    </button>


                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteTicket(
                          ticket.id
                        )
                      }
                      disabled={
                        deletingTicketId ===
                        ticket.id
                      }
                    >
                      {deletingTicketId ===
                      ticket.id
                        ? t(
                            "tickets.delete.deleting"
                          )
                        : t(
                            "tickets.delete.button"
                          )}
                    </button>

                  </div>

                </>

              )}

            </article>

          ))}

        </div>

      )}

    </main>
  )
}

export default Dashboard