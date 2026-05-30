import { createClerkClient } from "@clerk/nextjs/server";

function getClerkClient() {
  if (!process.env.CLERK_SECRET_KEY) {
    throw new Error("CLERK_SECRET_KEY is not set");
  }

  return createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  });
}

export async function getDemoUserIdByEmail(email: string) {
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
    throw new Error(`No Clerk user found for ${normalizedEmail}`);
  }

  return user.id;
}

export async function updateDemoUserPassword(userId: string, password: string) {
  const clerk = getClerkClient();

  await clerk.users.updateUser(userId, {
    password,
    signOutOfOtherSessions: true,
  });
}
