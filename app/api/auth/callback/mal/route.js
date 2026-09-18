import { callback } from '../../../../../lib/auth.mjs';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET(request) { return callback(request); }
