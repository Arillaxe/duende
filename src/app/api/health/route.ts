import { NextResponse } from 'next/server';

export const revalidate = 0;

export async function GET() {
  const hasEnv =
    Boolean(process.env.GOOGLE_DRIVE_API_KEY) &&
    Boolean(process.env.GOOGLE_DRIVE_FILE_ID);
  const status = hasEnv ? 200 : 500;

  return NextResponse.json(
    {
      ok: hasEnv,
      service: 'duende',
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
      missingEnv: hasEnv
        ? []
        : ['GOOGLE_DRIVE_API_KEY', 'GOOGLE_DRIVE_FILE_ID'],
    },
    { status },
  );
}
