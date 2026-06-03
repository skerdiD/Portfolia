const DEFAULT_DEMO_EMAIL = "demo@portfolia.app";

export function getDemoUserEmail() {
  return (
    process.env.DEMO_USER_EMAIL?.trim().toLowerCase() || DEFAULT_DEMO_EMAIL
  );
}

export function getOptionalDemoUserPassword() {
  return process.env.DEMO_USER_PASSWORD?.trim() || undefined;
}

export function getDemoUserPassword() {
  const password = getOptionalDemoUserPassword();

  if (!password) {
    throw new Error("DEMO_USER_PASSWORD is not set");
  }

  return password;
}
