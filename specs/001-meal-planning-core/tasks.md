# Implementation Tasks: Meal Planning Core Functionality

**Feature**: Meal Planning Core Functionality
**Branch**: `001-meal-planning-core`
**Created**: December 22, 2025

## Implementation Strategy

This implementation follows a phased approach, starting with the foundational elements and then implementing each user story in priority order. The MVP will include the first user story (meal pool management) with all necessary infrastructure, allowing for early testing and validation. Each user story is designed to be independently testable and deliverable.

## Dependencies

User stories have the following dependencies:
- US2 (Schedule Weekly Meals) depends on US1 (Meal Pool) - needs meals to schedule
- US4 (Auto-fill Empty Slots) depends on US1 (Meal Pool) and US2 (Schedule) - needs both meals and slots
- US3 (Toggle Slot Activity) depends on US2 (Schedule) - operates on slots
- US5 (Household Management) is foundational and should be implemented early but can run in parallel with other stories

## Parallel Execution Examples

Per User Story:
- US1: [P] Tasks T020-T025 can run in parallel after T019
- US2: [P] Tasks T040-T045 can run in parallel after T039
- US3: [P] Tasks T060-T065 can run in parallel after T059
- US4: [P] Tasks T080-T085 can run in parallel after T079
- US5: [P] Tasks T100-T105 can run in parallel after T099

## Phase 1: Setup

### Goal
Initialize the Next.js project with Supabase integration, configure environment, and set up the basic project structure.

### Independent Test Criteria
Project can be started with `npm run dev` and basic page renders without errors.

### Tasks
- [X] T001 Initialize Next.js project with TypeScript
- [X] T002 Configure Tailwind CSS and install Shadcn UI components
- [X] T003 Set up project structure per implementation plan
- [X] T004 Install and configure Supabase client
- [X] T005 Create environment configuration for Supabase
- [X] T006 Set up basic Next.js layout and styling
- [X] T007 Create basic page routing structure
- [X] T008 Configure TypeScript settings for project
- [X] T009 Set up ESLint and Prettier configuration
- [X] T010 Create README with project setup instructions

## Phase 2: Foundational

### Goal
Implement authentication, database schema, and core utility functions that will be used across all user stories.

### Independent Test Criteria
Users can authenticate via social login, database tables exist and are accessible, and basic utility functions work correctly.

### Tasks
- [X] T011 Set up Supabase authentication with social providers
- [X] T012 Create database schema (households, meals, slots, household_members tables)
- [X] T013 Implement Row Level Security policies for household isolation
- [X] T014 Create TypeScript types for all entities
- [X] T015 Implement Supabase client utilities and type definitions
- [X] T016 Create validation schemas for input validation
- [X] T017 Set up custom React hooks for data fetching
- [X] T018 Implement optimistic update utilities
- [X] T019 Create utility functions for date handling and shuffling

## Phase 3: User Story 1 - Manage Household Meal Pool (Priority: P1)

### Goal
Allow household members to add, edit, and delete meals in their shared meal pool.

### Independent Test Criteria
Users can successfully add, edit, and delete meals in their household's shared meal pool, with changes visible to all household members.

### Tasks
- [X] T020 [US1] Create Meal model/type definition
- [X] T021 [US1] Implement GET /api/meals endpoint to fetch household meals
- [X] T022 [US1] Implement POST /api/meals endpoint to create new meals
- [X] T023 [US1] Implement PUT /api/meals/[id] endpoint to update meals
- [X] T024 [US1] Implement DELETE /api/meals/[id] endpoint to delete meals
- [X] T025 [US1] Create meal management page UI
- [X] T026 [US1] Create meal form component for adding/editing
- [X] T027 [US1] Create meal list component to display meals
- [X] T028 [US1] Implement client-side meal CRUD operations
- [X] T029 [US1] Add validation for meal name (3-50 chars) and description (up to 500 chars)
- [X] T030 [US1] Add loading and error states for meal operations
- [X] T031 [US1] Implement optimistic updates for meal operations

## Phase 4: User Story 2 - Schedule Weekly Meals Using Calendar Grid (Priority: P2)

### Goal
Display a 7-day calendar grid showing scheduled meals, empty slots, and inactive slots with appropriate visual indicators.

### Independent Test Criteria
Users can view a 7-day calendar grid showing scheduled meals, empty slots, and inactive slots with appropriate visual indicators.

### Tasks
- [X] T032 [US2] Create Slot model/type definition
- [X] T033 [US2] Implement GET /api/slots endpoint to fetch household slots
- [X] T034 [US2] Implement PUT /api/slots/[id] endpoint to update individual slots
- [X] T035 [US2] Create slot calendar grid component
- [X] T036 [US2] Implement visual indicators for different slot states (active/empty, active/filled, inactive)
- [X] T037 [US2] Create slot detail modal/component for meal assignment
- [X] T038 [US2] Implement slot state visualization (highlighted, greyed out, filled)
- [X] T039 [US2] Add navigation for different weeks (previous/next week)
- [X] T040 [P] [US2] Create date range selector component
- [X] T041 [P] [US2] Implement slot click handler for meal assignment
- [X] T042 [P] [US2] Add slot loading states
- [X] T043 [P] [US2] Add responsive design for mobile view
- [ ] T044 [P] [US2] Implement slot drag-and-drop (optional enhancement)

## Phase 5: User Story 3 - Toggle Slot Activity and Clear Assignments (Priority: P3)

### Goal
Allow users to toggle individual meal slots between active and inactive states and remove meal assignments without deactivating slots.

### Independent Test Criteria
Users can toggle slots active/inactive and clear meal assignments independently, with visual feedback reflecting the current state.

### Tasks
- [X] T045 [US3] Update PUT /api/slots/[id] endpoint to handle is_active toggling
- [X] T046 [US3] Add UI controls for toggling slot activity
- [X] T047 [US3] Implement clear assignment functionality without deactivating slot
- [X] T048 [US3] Update slot component to show toggle controls
- [X] T049 [US3] Add visual feedback for active/inactive states
- [X] T050 [US3] Create confirmation dialogs for clearing assignments
- [X] T051 [US3] Implement keyboard shortcuts for toggling (optional enhancement)
- [X] T052 [US3] Add undo functionality for slot changes
- [X] T053 [US3] Update slot grid to reflect activity changes immediately
- [X] T054 [US3] Add tooltips explaining slot states
- [X] T055 [P] [US3] Create activity toggle button component
- [X] T056 [P] [US3] Add clear assignment button component
- [X] T057 [P] [US3] Implement batch toggle functionality (optional enhancement)
- [X] T058 [P] [US3] Add visual indicators for touch targets (44x44px minimum)
- [X] T059 [P] [US3] Add accessibility features for toggle controls

## Phase 6: User Story 4 - Auto-Fill Empty Slots with Random Meals (Priority: P4)

### Goal
Provide a "Fill Empty Slots" function that randomly assigns meals to all empty active slots, with duplicate prevention within the same week.

### Independent Test Criteria
Users can trigger the shuffle function to randomly assign meals to empty active slots, with duplicate prevention within the same week.

### Tasks
- [X] T060 [US4] Implement POST /api/slots/shuffle endpoint for meal shuffling
- [X] T061 [US4] Implement PUT /api/slots/batch-update endpoint for updating multiple slots
- [X] T062 [US4] Create shuffle algorithm with duplicate prevention
- [X] T063 [US4] Add "Fill Empty Slots" button to UI
- [ ] T064 [US4] Implement client-side shuffle functionality with optimistic updates
- [X] T065 [US4] Add loading state for shuffle operation (should complete within 3 seconds)
- [ ] T066 [US4] Show duplicate count after shuffle operation
- [X] T067 [US4] Handle case when meal pool is empty
- [X] T068 [US4] Handle case when more empty slots than unique meals
- [X] T069 [US4] Add confirmation dialog for shuffle operation
- [ ] T070 [US4] Implement undo functionality for shuffle operation
- [ ] T071 [P] [US4] Create shuffle results notification component
- [X] T072 [P] [US4] Add progress indicator for shuffle operation
- [X] T073 [P] [US4] Implement Fisher-Yates shuffle algorithm
- [ ] T074 [P] [US4] Add shuffle analytics for success rate tracking
- [ ] T075 [P] [US4] Create shuffle settings panel (optional enhancement)
- [ ] T076 [P] [US4] Add shuffle history (optional enhancement)
- [ ] T077 [P] [US4] Implement smart shuffle with preferences (optional enhancement)
- [X] T078 [P] [US4] Add visual animation for shuffle process
- [ ] T079 [P] [US4] Add performance optimization for large datasets

## Phase 7: User Story 5 - Household Management and Access Control (Priority: P5)

### Goal
Enable users to create or join households with shared access permissions.

### Independent Test Criteria
Users can create new households or join existing ones via shared codes, with all members having equal permissions to manage meals and schedules.

### Tasks
- [X] T080 [US5] Create Household model/type definition
- [X] T081 [US5] Create HouseholdMembers model/type definition
- [X] T082 [US5] Implement GET /api/households endpoint to fetch user households
- [X] T083 [US5] Implement POST /api/households endpoint to create new households
- [X] T084 [US5] Implement POST /api/households/join endpoint to join households
- [ ] T085 [US5] Create household creation form component
- [ ] T086 [US5] Create household join form component with code input
- [ ] T087 [US5] Implement household switching functionality
- [ ] T088 [US5] Add household member management UI
- [ ] T089 [US5] Create household settings page
- [ ] T090 [US5] Implement household invitation/share code generation
- [X] T091 [US5] Add validation for household name (3-50 chars) and max members (10)
- [X] T092 [US5] Add household-based data access controls
- [ ] T093 [US5] Create household selection dropdown
- [ ] T094 [US5] Implement household leave functionality
- [ ] T095 [P] [US5] Create household dashboard layout
- [ ] T096 [P] [US5] Add household member role management (equal permissions)
- [X] T097 [P] [US5] Implement household deletion (admin only)
- [ ] T098 [P] [US5] Add household data retention policy (90 days for inactive)
- [ ] T099 [P] [US5] Create household activity monitoring

## Phase 8: Polish & Cross-Cutting Concerns

### Goal
Complete the implementation with additional features, testing, and polish to ensure a production-ready application.

### Independent Test Criteria
All user stories work together seamlessly, with proper error handling, loading states, and a polished user experience.

### Tasks
- [X] T100 Add comprehensive error handling and user feedback
- [X] T101 Implement proper loading states throughout the application
- [ ] T102 Add comprehensive unit tests for business logic
- [ ] T103 Add integration tests for API endpoints
- [ ] T104 Add end-to-end tests for user workflows
- [ ] T105 Create documentation for API endpoints
- [ ] T106 Add analytics and logging for user actions
- [X] T107 Implement proper SEO and meta tags
- [X] T108 Add accessibility features and ARIA labels
- [X] T109 Optimize performance and implement caching where appropriate
- [X] T110 Add responsive design for all screen sizes
- [X] T111 Implement proper form validation and error messages
- [ ] T112 Add internationalization support (optional enhancement)
- [X] T113 Create deployment configuration for Vercel
- [X] T114 Add security headers and content security policy
- [X] T115 Implement data backup and recovery procedures
- [ ] T116 Add user onboarding flow
- [ ] T117 Create help documentation and tooltips
- [ ] T118 Add PWA capabilities for offline access (optional enhancement)
- [ ] T119 Final testing and bug fixes before release
- [ ] T120 Prepare release notes and deployment checklist