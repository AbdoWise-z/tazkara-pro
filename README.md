# Tazkara Pro

A modern ticket booking and management system built with Next.js and Prisma.

## Features

- User authentication and authorization with Clerk
- Event browsing and ticket booking
- Real-time seat availability
- Secure payment processing
- Event management dashboard
- Booking history and e-tickets
- Admin panel for event management

## Tech Stack

- **Frontend:** Next.js, React
- **Backend:** Next.js API Routes
- **Database:** MongoDB with Prisma ORM
- **Authentication:** Clerk
- **Styling:** Tailwind CSS

## Prerequisites

Before you begin, ensure you have installed:
- Node.js (v18 or higher)
- npm or yarn
- MongoDB

## Installation

1. Clone the repository:
```bash
git clone https://github.com/AbdoWise-z/tazkara-pro.git
cd tazkara-pro
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up Clerk:
- Sign up for a Clerk account at [clerk.dev](https://clerk.dev)
- Create a new application in the Clerk dashboard
- Copy your API keys

4. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:
```env
DATABASE_URL="mongodb://username:password@localhost:27017/tazkara_pro"

# Clerk environment variables
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your-publishable-key
CLERK_SECRET_KEY=sk_test_your-secret-key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

5. Set up the database:
```bash
# Generate Prisma Client
npx prisma generate
```

## Development

To run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

### Deploy to Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com).

1. Push your code to a Git repository
2. Import your project to Vercel
3. Add environment variables in the Vercel dashboard
    - Add all Clerk environment variables
    - Add your MongoDB DATABASE_URL
4. Deploy!

### Manual Deployment

1. Build the application:
```bash
npm run build
# or
yarn build
```

2. Start the production server:
```bash
npm start
# or
yarn start
```

## Database Management

### Prisma Studio

To view and manage your database through Prisma Studio:

```bash
npx prisma studio
```

## Authentication

This project uses Clerk for authentication and user management. Some key features include:

- Social login providers
- Email and password authentication
- Multi-factor authentication
- User profile management
- Role-based access control

To customize Clerk's appearance and settings:
1. Visit your Clerk Dashboard
2. Navigate to Customization
3. Modify the theme, branding, and other settings as needed

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email [support@example.com](mailto:support@example.com) or open an issue in the GitHub repository.