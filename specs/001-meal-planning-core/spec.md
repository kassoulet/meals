# Feature Specification: Meal Planning Core Functionality

**Feature Branch**: `001-meal-planning-core`
**Created**: December 22, 2025
**Status**: Draft
**Input**: User description: "Project Specification: MealFill (Working Name) 1. Executive Summary A utility-first web application designed to eliminate decision fatigue in meal planning. Users maintain a collective pool of meals and a weekly schedule. The app identifies \"Active\" but \"Empty\" slots and shuffles the meal pool to fill them instantly. 2. Technical Stack Framework: Next.js (App Router) Database/Auth: Supabase (PostgreSQL) hosted on Supabase Styling: Tailwind CSS + Shadcn UI Deployment: Vercel (Free Tier) 3. Data Model (Supabase Schema) households: id (UUID), name (Text) — Groups users together. meals: id, household_id, name (Text), description (Text, optional) — The shared pool. slots: id, household_id, date (Date), slot_type (String: 'lunch', 'dinner') is_active (Boolean): Default True. If False, the slot is ignored. meal_id (FK, nullable): The meal assigned to this slot. 4. Core Functional Requirements Phase 1: The Meal Pool Users can add, edit, and delete meals. Meals are global to the household, not the individual user. Phase 2: The Grid (The Planner) View a 7-day calendar (standard or list view). Slot Toggling: Each slot can be toggled between Active and Inactive. Inactive slots should be visually greyed out/hatched. Manual Assignment: Clicking an Active/Empty slot allows a user to manually pick a meal from the pool. Clearing: Users can remove a meal from a specific slot without making the slot inactive. Phase 3: The \"Magic Shuffle\" Logic Trigger: A \"Fill Empty Slots\" button. Mechanism: Identify all is_active === true slots where meal_id === null for the current view. Fetch all available meals from the meals table. Perform a random shuffle (Fisher-Yates) on the meal list. Assign shuffled meals to the empty slots sequentially. Constraint: Ensure no meal is duplicated within the same week unless the number of empty slots exceeds the total meal pool. 5. User Interface & Experience (UI/UX) Mobile-First: Large touch targets for toggling slots. Visual Feedback: A distinct visual difference between: Empty/Active: Needs a meal (Highlighted). Inactive: We aren't eating here/Eating out (Dark/Grey). Filled: Meal name visible. Optimistic Updates: When \"Shuffle\" is clicked, the UI should update immediately while the database process runs in the background. 6. Authentication & Permissions Users sign up and either Create or Join a household via a shared code/link. All members of a household have equal permissions to shuffle, add meals, or toggle slots. 7. Development Roadmap for Agent Initialize: Setup Next.js with Tailwind and Supabase client. DB Setup: Create meals and slots tables with RLS (Row Level Security) for household-based access. CRUD: Build the \"Meal Management\" page. The Planner: Build the 7-day grid with \"Active/Inactive\" toggle logic. The Shuffle: Implement the fillEmptySlots function and the batch update to the database."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Manage Household Meal Pool (Priority: P1)

As a household member, I want to maintain a shared pool of meals so that my family and I can easily plan our weekly meals without having to think about what to cook each day.

**Why this priority**: This is the foundational functionality that enables all other features. Without a meal pool, the scheduling and shuffle features have nothing to work with.

**Independent Test**: Users can successfully add, edit, and delete meals in their household's shared meal pool, with changes visible to all household members.

**Acceptance Scenarios**:

1. **Given** I am logged into my household account, **When** I add a new meal to the pool, **Then** the meal appears in the shared meal list and is available for scheduling
2. **Given** I have meals in my household's pool, **When** I edit or delete a meal, **Then** the changes are reflected consistently across all household members' views

---

### User Story 2 - Schedule Weekly Meals Using Calendar Grid (Priority: P2)

As a household member, I want to view and manage a 7-day meal schedule in a calendar format so that I can see what meals are planned for each day and time slot.

**Why this priority**: This provides the core scheduling interface that connects the meal pool with the actual planning experience.

**Independent Test**: Users can view a 7-day calendar grid showing scheduled meals, empty slots, and inactive slots with appropriate visual indicators.

**Acceptance Scenarios**:

1. **Given** I am viewing the 7-day planner, **When** I see different slot states (active/empty, active/filled, inactive), **Then** each state is visually distinct and clearly indicates its status
2. **Given** I have an active empty slot, **When** I click on it, **Then** I can select a meal from the household pool to assign to that slot

---

### User Story 3 - Toggle Slot Activity and Clear Assignments (Priority: P3)

As a household member, I want to toggle individual meal slots between active and inactive states and remove meal assignments without deactivating slots so that I can customize my weekly meal schedule based on changing needs.

**Why this priority**: This provides flexibility in the scheduling system, allowing users to skip meals or mark days as "eating out" without losing the slot structure.

**Independent Test**: Users can toggle slots active/inactive and clear meal assignments independently, with visual feedback reflecting the current state.

**Acceptance Scenarios**:

1. **Given** I am viewing the meal planner, **When** I toggle a slot's activity status, **Then** the visual representation updates to show the new state and affects the shuffle functionality appropriately
2. **Given** I have a filled slot, **When** I clear the meal assignment, **Then** the slot becomes empty but remains active

---

### User Story 4 - Auto-Fill Empty Slots with Random Meals (Priority: P4)

As a household member, I want to automatically fill all empty active slots with random meals from my pool so that I can quickly generate a complete meal plan without manual selection.

**Why this priority**: This provides the "magic" functionality that eliminates decision fatigue by automatically populating empty slots with available meals.

**Independent Test**: Users can trigger the shuffle function to randomly assign meals to empty active slots, with duplicate prevention within the same week.

**Acceptance Scenarios**:

1. **Given** I have empty active slots in my planner, **When** I click the "Fill Empty Slots" button, **Then** all empty active slots are populated with random meals from the household pool
2. **Given** I have more empty slots than unique meals, **When** I shuffle, **Then** meals are distributed with minimal duplication (no duplicates unless required)

---

### User Story 5 - Household Management and Access Control (Priority: P5)

As a user, I want to create or join a household with shared access permissions so that multiple family members can contribute to and manage the meal planning process together.

**Why this priority**: This enables collaborative meal planning, which is central to the application's value proposition for families and households.

**Independent Test**: Users can create new households or join existing ones via shared codes, with all members having equal permissions to manage meals and schedules.

**Acceptance Scenarios**:

1. **Given** I am a registered user, **When** I create a new household, **Then** I become a member with full permissions and can invite others to join
2. **Given** I have a household join code, **When** I enter the code, **Then** I gain access to that household's meal pool and schedule with equal permissions

---

### Edge Cases

- What happens when a user tries to shuffle but the meal pool is empty?
- How does the system handle network interruptions during the shuffle operation?
- What occurs when multiple users simultaneously modify the same meal slot?
- How does the system handle invalid dates or slot types?
- What happens when a household reaches the maximum number of members?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow household members to add, edit, and delete meals in the shared meal pool
- **FR-002**: System MUST display a 7-day calendar grid showing meal slots with distinct visual states (active/empty, active/filled, inactive)
- **FR-003**: Users MUST be able to toggle individual slots between active and inactive states
- **FR-004**: Users MUST be able to assign meals from the pool to empty active slots through manual selection
- **FR-005**: Users MUST be able to clear meal assignments from slots without changing the slot's active status
- **FR-006**: System MUST provide a "Fill Empty Slots" function that randomly assigns meals to all empty active slots
- **FR-007**: System MUST prevent meal duplication within the same week when possible during shuffle operations
- **FR-008**: System MUST support household creation and membership with shared access permissions
- **FR-009**: System MUST implement optimistic UI updates when shuffling meals to improve user experience
- **FR-010**: System MUST enforce household-based data isolation so users only see their household's information
- **FR-011**: System MUST provide large touch targets and mobile-first interface design for easy interaction
- **FR-012**: System MUST maintain meal assignments persistently across sessions and devices

### Key Entities *(include if feature involves data)*

- **Household**: Represents a group of users who share meal planning responsibilities; contains meals and slots; has a unique identifier and name
- **Meal**: Represents a food item that can be scheduled; belongs to a household; has a name and optional description
- **Slot**: Represents a specific day and meal type (lunch/dinner); belongs to a household; has a date, slot type, active status, and optional meal assignment

## Clarifications

### Session 2025-12-22

- Q: What is the maximum number of members allowed per household? → A: Maximum of 10 members per household
- Q: How often should household data be synchronized between members' devices? → A: No sync needed, app is a website with real-time updates
- Q: What should be the character limit for meal names? → A: 3-50 characters
- Q: Should meal descriptions be required, and what should be the character limit? → A: Optional, up to 500 characters
- Q: How far in advance should users be able to plan meals? → A: Up to 4 weeks
- Q: What authentication method should be used for user registration and login? → A: Social login only (Google, Facebook, Apple accounts)
- Q: How long should the system retain meal planning data for inactive households before deletion? → A: 90 days
- Q: What rate limiting strategy should be implemented for API endpoints to prevent abuse? → A: No rate limiting
- Q: How should the system handle and display error messages to users? → A: User-friendly messages with resolution guidance
- Q: What data backup strategy should be implemented for user data protection? → A: Daily automated backups for 30 days
- Q: What notification strategy should be implemented for important system events? → A: In-app notifications only
- Q: How should the system handle concurrent edits to the same meal slot by different household members? → A: Last-write-wins with user notification

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create and manage at least 50 meals in their household pool without performance degradation
- **SC-002**: The "Fill Empty Slots" function completes and updates the UI within 3 seconds for up to 14 empty slots
- **SC-003**: At least 90% of shuffle operations result in no meal duplication within the same week when the meal pool exceeds the number of empty slots
- **SC-004**: Users can successfully create or join households and access shared meal data within 2 minutes of registration
- **SC-005**: The meal planning interface is usable on mobile devices with touch targets of at least 44x44 pixels
- **SC-006**: 95% of users can successfully assign meals to slots and toggle slot states without errors during initial testing