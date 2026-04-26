-- CreateIndex
CREATE INDEX "AuthAuditLog_userId_idx" ON "AuthAuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuthAuditLog_createdAt_idx" ON "AuthAuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "AuthAuditLog_action_idx" ON "AuthAuditLog"("action");

-- CreateIndex
CREATE INDEX "AuthAuditLog_userId_createdAt_idx" ON "AuthAuditLog"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "AuthAuditLog_action_createdAt_idx" ON "AuthAuditLog"("action", "createdAt");

-- CreateIndex
CREATE INDEX "Event_status_idx" ON "Event"("status");

-- CreateIndex
CREATE INDEX "Event_category_idx" ON "Event"("category");

-- CreateIndex
CREATE INDEX "Event_city_idx" ON "Event"("city");

-- CreateIndex
CREATE INDEX "Event_startDate_idx" ON "Event"("startDate");

-- CreateIndex
CREATE INDEX "Event_createdAt_idx" ON "Event"("createdAt");

-- CreateIndex
CREATE INDEX "Event_ticketsSold_idx" ON "Event"("ticketsSold");

-- CreateIndex
CREATE INDEX "Event_status_startDate_idx" ON "Event"("status", "startDate");

-- CreateIndex
CREATE INDEX "Event_status_category_idx" ON "Event"("status", "category");

-- CreateIndex
CREATE INDEX "Event_status_city_idx" ON "Event"("status", "city");

-- CreateIndex
CREATE INDEX "Event_category_city_idx" ON "Event"("category", "city");

-- CreateIndex
CREATE INDEX "Event_status_startDate_category_idx" ON "Event"("status", "startDate", "category");

-- CreateIndex
CREATE INDEX "Event_title_idx" ON "Event"("title");

-- CreateIndex
CREATE INDEX "LineupAct_eventId_idx" ON "LineupAct"("eventId");

-- CreateIndex
CREATE INDEX "LineupAct_role_idx" ON "LineupAct"("role");

-- CreateIndex
CREATE INDEX "LineupAct_eventId_sortOrder_idx" ON "LineupAct"("eventId", "sortOrder");

-- CreateIndex
CREATE INDEX "LineupAct_eventId_role_idx" ON "LineupAct"("eventId", "role");

-- CreateIndex
CREATE INDEX "SavedEvent_userId_idx" ON "SavedEvent"("userId");

-- CreateIndex
CREATE INDEX "SavedEvent_eventId_idx" ON "SavedEvent"("eventId");

-- CreateIndex
CREATE INDEX "SavedEvent_createdAt_idx" ON "SavedEvent"("createdAt");

-- CreateIndex
CREATE INDEX "SavedEvent_userId_createdAt_idx" ON "SavedEvent"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");

-- CreateIndex
CREATE INDEX "Session_userId_expiresAt_idx" ON "Session"("userId", "expiresAt");

-- CreateIndex
CREATE INDEX "Ticket_userId_idx" ON "Ticket"("userId");

-- CreateIndex
CREATE INDEX "Ticket_eventId_idx" ON "Ticket"("eventId");

-- CreateIndex
CREATE INDEX "Ticket_tierId_idx" ON "Ticket"("tierId");

-- CreateIndex
CREATE INDEX "Ticket_status_idx" ON "Ticket"("status");

-- CreateIndex
CREATE INDEX "Ticket_expiresAt_idx" ON "Ticket"("expiresAt");

-- CreateIndex
CREATE INDEX "Ticket_createdAt_idx" ON "Ticket"("createdAt");

-- CreateIndex
CREATE INDEX "Ticket_userId_status_idx" ON "Ticket"("userId", "status");

-- CreateIndex
CREATE INDEX "Ticket_eventId_status_idx" ON "Ticket"("eventId", "status");

-- CreateIndex
CREATE INDEX "Ticket_userId_eventId_idx" ON "Ticket"("userId", "eventId");

-- CreateIndex
CREATE INDEX "Ticket_status_expiresAt_idx" ON "Ticket"("status", "expiresAt");

-- CreateIndex
CREATE INDEX "TicketTier_eventId_idx" ON "TicketTier"("eventId");

-- CreateIndex
CREATE INDEX "TicketTier_price_idx" ON "TicketTier"("price");

-- CreateIndex
CREATE INDEX "TicketTier_eventId_sortOrder_idx" ON "TicketTier"("eventId", "sortOrder");

-- CreateIndex
CREATE INDEX "TicketTier_eventId_price_idx" ON "TicketTier"("eventId", "price");

-- CreateIndex
CREATE INDEX "TicketTier_sold_idx" ON "TicketTier"("sold");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");

-- CreateIndex
CREATE INDEX "User_lastLogin_idx" ON "User"("lastLogin");

-- CreateIndex
CREATE INDEX "User_emailVerified_idx" ON "User"("emailVerified");

-- CreateIndex
CREATE INDEX "User_status_role_idx" ON "User"("status", "role");
