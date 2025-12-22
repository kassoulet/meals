# Data Model: Meal Planning Core Functionality

## Entities

### Household
- **id**: UUID (Primary Key)
- **name**: Text (3-50 characters, required)
- **created_at**: Timestamp (auto-generated)
- **updated_at**: Timestamp (auto-generated)
- **max_members**: Integer (default: 10, max: 10 as per spec)

**Relationships**:
- One-to-many with Meals (household has many meals)
- One-to-many with Slots (household has many slots)
- Many-to-many with Users through household_members table

### Meal
- **id**: UUID (Primary Key)
- **household_id**: UUID (Foreign Key to Household, required)
- **name**: Text (3-50 characters, required)
- **description**: Text (optional, up to 500 characters)
- **created_at**: Timestamp (auto-generated)
- **updated_at**: Timestamp (auto-generated)

**Relationships**:
- Many-to-one with Household (meal belongs to one household)
- One-to-many with Slots (meal can be assigned to multiple slots)

### Slot
- **id**: UUID (Primary Key)
- **household_id**: UUID (Foreign Key to Household, required)
- **date**: Date (required, up to 4 weeks in advance)
- **slot_type**: String (enum: 'lunch', 'dinner', required)
- **is_active**: Boolean (default: true, required)
- **meal_id**: UUID (Foreign Key to Meal, nullable)
- **created_at**: Timestamp (auto-generated)
- **updated_at**: Timestamp (auto-generated)

**Relationships**:
- Many-to-one with Household (slot belongs to one household)
- Many-to-one with Meal (slot optionally assigned to one meal)

### User
- **id**: UUID (Primary Key, from Supabase Auth)
- **email**: Text (from Supabase Auth)
- **created_at**: Timestamp (auto-generated)

### Household_Members (Join Table)
- **id**: UUID (Primary Key)
- **household_id**: UUID (Foreign Key to Household, required)
- **user_id**: UUID (Foreign Key to User, required)
- **role**: String (default: 'member', required)
- **created_at**: Timestamp (auto-generated)

## Database Hosting
- Database: PostgreSQL hosted on Supabase
- Authentication: Supabase Auth service
- Real-time capabilities: Supabase real-time subscriptions

## Validation Rules

1. **Household**:
   - Name must be 3-50 characters
   - Maximum 10 members per household

2. **Meal**:
   - Name must be 3-50 characters
   - Description optional, up to 500 characters
   - Must belong to a valid household

3. **Slot**:
   - Date must be within 4 weeks from current date
   - slot_type must be 'lunch' or 'dinner'
   - Must belong to a valid household
   - meal_id must be null or reference a valid meal in the same household

## State Transitions

### Slot States
- **Active/Empty**: is_active=true, meal_id=null (needs a meal)
- **Active/Filled**: is_active=true, meal_id=valid_meal_id (meal assigned)
- **Inactive**: is_active=false (ignored by system)

## Indexes
- Household.id (primary)
- Meal.household_id (foreign key index)
- Slot.household_id (foreign key index)
- Slot.date (for date range queries)
- Slot.slot_type (for filtering by meal type)
- Slot.is_active (for filtering active slots)

## Backup Strategy
- Daily automated backups retained for 30 days as per specification
- All data should be recoverable within 24 hours of request

## Concurrency Handling
- Last-write-wins with user notification for concurrent edits
- Version tracking may be implemented for critical data changes