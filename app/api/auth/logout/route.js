import { logout } from '../../../../lib/auth.mjs';
export const runtime = 'nodejs';
export async function POST(request) { return logout(request); }
