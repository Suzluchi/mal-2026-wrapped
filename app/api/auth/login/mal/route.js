import { login } from '../../../../../lib/auth.mjs';
export const runtime = 'nodejs';
export async function POST(request) { return login(request); }
