export type TicketStatus =
  | "open"
  | "in_progress"
  | "completed"

export type TicketPriority =
  | "low"
  | "medium"
  | "high"

export interface Ticket {
  id: number
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  created_at: string
}

export interface CreateTicketData {
  title: string
  description: string
  priority: TicketPriority
}

export interface UpdateTicketData {
  title: string
  description: string
  priority: TicketPriority
}

export interface UpdateTicketStatusData {
  status: TicketStatus
}