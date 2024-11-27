import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  providers: [
    CredentialsProvider({
      // Define custom credentials for logging in
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Connect to your database to validate user
        const user = { id: 1, name: 'Manager', email: 'manager@example.com' }; // Mock user

        if (
          credentials.username === 'manager' &&
          credentials.password === 'password123'
        ) {
          return user; // Return user object on success
        }

        return null; // Return null if user validation fails
      },
    }),
  ],
  session: {
    strategy: 'jwt', // Use JSON Web Tokens for session management
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },
});
