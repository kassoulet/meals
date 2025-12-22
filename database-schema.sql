-- SQL script to set up the MealFill database schema
-- This should be run in the Supabase SQL editor

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