# Setup Instructions

## Environment Configuration

1. Copy the `.env.sample` file and rename it to `.env.development.local` for development and `.env.production.local` for production.
2. Replace the placeholder values in these files with your actual Appwrite credentials.

## Running the Application

1. Install dependencies: `npm install` or `yarn install`
2. Start the development server: `npx expo start --dev-client`
3. Follow the Expo CLI instructions to run the app on your desired platform (iOS or Android)

## Important Notes

- Ensure that you have set up an Appwrite project and have the necessary credentials before running the app.
- Do not commit the `.env.development.local` and `.env.production.local` files to version control to keep your credentials secure.
- The app is designed to work with the Appwrite & firebase backend. Make sure your Appwrite & firebase backend is running and accessible.


