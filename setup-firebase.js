#!/usr/bin/env node

console.log("🔥 Firebase Setup Helper");
console.log("========================\n");

console.log("To set up Firebase for this project, follow these steps:\n");

console.log("1. Go to https://console.firebase.google.com/");
console.log("2. Create a new project or select an existing one");
console.log("3. Go to Project Settings > General");
console.log('4. Scroll down to "Your apps" section');
console.log("5. Click the web app icon (</>) to add a web app");
console.log('6. Register your app with a nickname (e.g., "poop-tracker-web")');
console.log("7. Copy the config values from the provided code snippet\n");

console.log(
  "Then create a .env.local file in the project root with the following content:\n"
);

const envTemplate = `# Firebase Configuration
# Replace these values with your actual Firebase project configuration

NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Example (replace with your actual values):
# NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=my-project.firebaseapp.com
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=my-project
# NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=my-project.appspot.com
# NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
# NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
`;

console.log(envTemplate);

console.log("After creating the .env.local file:");
console.log("1. Restart your development server (npm run dev)");
console.log(
  "2. Check the browser console for Firebase initialization messages"
);
console.log("3. Try signing up with a test account to verify the connection\n");

console.log("Additional Firebase setup steps:");
console.log("- Enable Authentication > Sign-in method > Email/Password");
console.log("- Create Firestore Database > Start in production mode");
console.log("- Set up Firestore security rules (optional for now)\n");

console.log("Need help? Check the README.md file for detailed instructions.");
