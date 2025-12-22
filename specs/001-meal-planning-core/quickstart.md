# Quickstart: Meal Planning Core Functionality

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (for database and authentication, hosted on Supabase)
- Vercel account (for application deployment)
- Git

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd <repository-name>

# Install dependencies
npm install
# or
yarn install
```

### 2. Configure Supabase

1. Create a Supabase project at [supabase.io](https://supabase.io)
2. Copy your Project URL and API Key from the dashboard
3. Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Set up Database Schema

Run the following SQL commands in your Supabase SQL editor or use the Supabase CLI:

```sql
-- Create households table
CREATE TABLE households (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL CHECK (char_length(name) >= 3 AND char_length(name) <= 50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  max_members INTEGER DEFAULT 10 CHECK (max_members <= 10)
);

-- Create meals table
CREATE TABLE meals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (char_length(name) >= 3 AND char_length(name) <= 50),
  description TEXT CHECK (char_length(description) <= 500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create slots table
CREATE TABLE slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  date DATE NOT NULL CHECK (date <= (CURRENT_DATE + INTERVAL '4 weeks')),
  slot_type TEXT NOT NULL CHECK (slot_type IN ('lunch', 'dinner')),
  is_active BOOLEAN DEFAULT true,
  meal_id UUID REFERENCES meals(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create household_members table
CREATE TABLE household_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT DEFAULT 'member',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE households ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE household_members ENABLE ROW LEVEL SECURITY;

-- Create policies for household-based access
CREATE POLICY "Users can view their own households" ON households
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM household_members
    WHERE household_members.household_id = households.id
    AND household_members.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own households" ON households
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM household_members
    WHERE household_members.household_id = households.id
    AND household_members.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own households" ON households
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM household_members
    WHERE household_members.household_id = households.id
    AND household_members.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own households" ON households
  FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM household_members
    WHERE household_members.household_id = households.id
    AND household_members.user_id = auth.uid()
  ));

-- Policies for meals table
CREATE POLICY "Users can view meals in their households" ON meals
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM household_members
    WHERE household_members.household_id = meals.household_id
    AND household_members.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert meals in their households" ON meals
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM household_members
    WHERE household_members.household_id = meals.household_id
    AND household_members.user_id = auth.uid()
  ));

CREATE POLICY "Users can update meals in their households" ON meals
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM household_members
    WHERE household_members.household_id = meals.household_id
    AND household_members.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete meals in their households" ON meals
  FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM household_members
    WHERE household_members.household_id = meals.household_id
    AND household_members.user_id = auth.uid()
  ));

-- Policies for slots table
CREATE POLICY "Users can view slots in their households" ON slots
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM household_members
    WHERE household_members.household_id = slots.household_id
    AND household_members.user_id = auth.uid()
  ));

CREATE POLICY "Users can update slots in their households" ON slots
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM household_members
    WHERE household_members.household_id = slots.household_id
    AND household_members.user_id = auth.uid()
  ));

-- Policies for household_members table
CREATE POLICY "Users can view household members in their households" ON household_members
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM household_members AS hm2
    WHERE hm2.household_id = household_members.household_id
    AND hm2.user_id = auth.uid()
  ));
```

### 4. Configure Social Authentication

1. In your Supabase dashboard, go to Authentication → Settings
2. Enable the social providers you want to support (Google, Facebook, Apple)
3. Add your domain to the "Redirect URLs" (e.g., http://localhost:3000/api/auth/callback)

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## Key Endpoints

- `GET /api/households` - Get user's households
- `POST /api/households` - Create a new household
- `GET /api/meals` - Get meals for a household
- `POST /api/meals` - Create a new meal
- `PUT /api/meals/[id]` - Update a meal
- `DELETE /api/meals/[id]` - Delete a meal
- `GET /api/slots` - Get slots for a household within date range
- `PUT /api/slots/batch-update` - Update multiple slots (for shuffle functionality)
- `POST /api/auth/join-household` - Join a household with a code

## Testing

Run the test suite:

```bash
npm run test
# or
yarn test
```

Run specific test types:

```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# End-to-end tests
npm run test:e2e
```

## Deployment

### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_supabase_service_role_key
```

## Error Handling

The application uses user-friendly error messages with resolution guidance. Error responses follow the format:

```json
{
  "error": "Descriptive error message",
  "code": "ERROR_CODE",
  "suggestion": "How to resolve this error"
}
```

## Backup Strategy

The system implements daily automated backups for 30 days as specified. Data recovery can be performed through Supabase's built-in backup functionality.

## Notifications

The application uses in-app notifications only for important system events. Notifications are displayed through the UI components and do not rely on external services.