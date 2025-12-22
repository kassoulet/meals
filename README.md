# Meal Planning App

A utility-first web application designed to eliminate decision fatigue in meal planning. Users maintain a collective pool of meals and a weekly schedule. The app identifies "Active" but "Empty" slots and shuffles the meal pool to fill them instantly.

## Features

- **Meal Pool Management**: Add, edit, and delete meals in a shared household pool
- **Weekly Meal Planning**: View and manage a 7-day meal schedule in a calendar format
- **Slot Toggling**: Toggle individual meal slots between Active and Inactive states
- **Meal Assignment**: Manually assign meals from the pool to empty slots
- **Magic Shuffle**: Automatically fill all empty active slots with random meals from your pool
- **Household Management**: Create or join households with shared access permissions

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Database/Authentication**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS + Shadcn UI
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (for database and authentication)
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure Supabase:
   1. Create a Supabase project at [supabase.io](https://supabase.io)
   2. Copy your Project URL and API Key from the dashboard
   3. Create a `.env.local` file in the project root:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

The application will be available at `http://localhost:3000`.

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (for server-side operations)

## Database Schema

The application uses the following tables:

- `households`: Groups users together
- `meals`: Shared pool of meals for each household
- `slots`: Meal slots for specific dates and times
- `household_members`: Junction table for user-household relationships

For the complete schema definition, see the setup instructions in the quickstart guide.

## API Endpoints

- `GET /api/households` - Get user's households
- `POST /api/households` - Create a new household
- `GET /api/meals` - Get meals for a household
- `POST /api/meals` - Create a new meal
- `PUT /api/meals/[id]` - Update a meal
- `DELETE /api/meals/[id]` - Delete a meal
- `GET /api/slots` - Get slots for a household within date range
- `PUT /api/slots/batch-update` - Update multiple slots (for shuffle functionality)
- `POST /api/slots/shuffle` - Shuffle empty active slots with random meals
- `POST /api/households/join` - Join a household with a code

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

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.