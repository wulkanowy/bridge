export function requireEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined) throw new Error(`Environment variable ${name} not set`);
  return value;
}
