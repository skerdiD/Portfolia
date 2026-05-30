const DEFAULT_DEMO_EMAIL = "demo@portfolia.app";

export function getDemoUserEmail() {
  return (
    process.env.DEMO_USER_EMAIL?.trim().toLowerCase() || DEFAULT_DEMO_EMAIL
  );
}

export function getDemoUserPassword() {
  const password = process.env.DEMO_USER_PASSWORD?.trim();

  if (!password) {
    throw new Error("DEMO_USER_PASSWORD is not set");
  }

  return password;
}
