import { createClerkClient } from "@clerk/nextjs/server";

function getClerkClient() {
  if (!process.env.CLERK_SECRET_KEY) {
    throw new Error("CLERK_SECRET_KEY is not set");
  }

  return createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  });
}

export async function getDemoUserByEmail(email: string) {
  const clerk = getClerkClient();
  const normalizedEmail = email.trim().toLowerCase();
  const users = await clerk.users.getUserList({
    emailAddress: [normalizedEmail],
    limit: 10,
  });
  const user = users.data.find((candidate) =>
    candidate.emailAddresses.some(
      (address) => address.emailAddress.toLowerCase() === normalizedEmail,
    ),
  );

  if (!user) {
    return undefined;
  }

  return user;
}

export async function getDemoUserIdByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await getDemoUserByEmail(normalizedEmail);

  if (!user) {
    throw new Error(`No Clerk user found for ${normalizedEmail}`);
  }

  return user.id;
}

export async function ensureDemoUserByEmail(email: string, password?: string) {
  const clerk = getClerkClient();
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await getDemoUserByEmail(normalizedEmail);

  if (existingUser) {
    return { userId: existingUser.id, created: false };
  }

  if (!password) {
    throw new Error(
      `No Clerk user found for ${normalizedEmail}. Add DEMO_USER_PASSWORD to .env.local or pass --password to create it automatically.`,
    );
  }

  const user = await clerk.users.createUser({
    emailAddress: [normalizedEmail],
    password,
    skipPasswordChecks: true,
    skipLegalChecks: true,
  });

  return { userId: user.id, created: true };
}

export async function updateDemoUserPassword(userId: string, password: string) {
  const clerk = getClerkClient();

  await clerk.users.updateUser(userId, {
    password,
    signOutOfOtherSessions: true,
  });
}
