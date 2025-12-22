# OpenAPI Contract: Meal Planning Core Functionality

## Authentication API

### POST /api/auth/login
Login with social provider
- Request: `{provider: string}` (e.g., "google", "facebook", "apple")
- Response: `{session: object, user: object}`

### POST /api/auth/logout
Logout user
- Request: `{}`
- Response: `{success: boolean}`

## Household API

### GET /api/households
Get user's households
- Response: `[{id: string, name: string, created_at: string, updated_at: string}]`

### POST /api/households
Create a new household
- Request: `{name: string}`
- Response: `{id: string, name: string, created_at: string, updated_at: string}`

### POST /api/households/join
Join a household with a code
- Request: `{code: string}`
- Response: `{success: boolean, household: object}`

## Meals API

### GET /api/meals?household_id={id}
Get meals for a household
- Response: `[{id: string, household_id: string, name: string, description: string, created_at: string, updated_at: string}]`

### POST /api/meals
Create a new meal
- Request: `{household_id: string, name: string, description?: string}`
- Response: `{id: string, household_id: string, name: string, description: string, created_at: string, updated_at: string}`

### PUT /api/meals/{id}
Update a meal
- Request: `{name?: string, description?: string}`
- Response: `{id: string, household_id: string, name: string, description: string, updated_at: string}`

### DELETE /api/meals/{id}
Delete a meal
- Response: `{success: boolean}`

## Slots API

### GET /api/slots?household_id={id}&start_date={date}&end_date={date}
Get slots for a household within date range (default: current week)
- Response: `[{id: string, household_id: string, date: string, slot_type: string, is_active: boolean, meal_id: string|null, meal: object|null, created_at: string, updated_at: string}]`

### PUT /api/slots/{id}
Update a single slot
- Request: `{is_active?: boolean, meal_id?: string|null}`
- Response: `{id: string, household_id: string, date: string, slot_type: string, is_active: boolean, meal_id: string|null, updated_at: string}`

### PUT /api/slots/batch-update
Update multiple slots (for shuffle functionality)
- Request: `{updates: [{id: string, is_active?: boolean, meal_id?: string|null}]}`
- Response: `{success: boolean, updated_count: number}`

### POST /api/slots/shuffle
Shuffle empty active slots with random meals
- Request: `{household_id: string, start_date: string, end_date: string}`
- Response: `{success: boolean, updated_slots: array, duplicate_count: number}`