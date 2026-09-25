import { cookies } from 'next/headers';
import { config,sessionName,unseal } from '../../../lib/auth.mjs';
import { fetchBadges } from '../../../lib/badges.mjs';
export const dynamic='force-dynamic';
export async function GET(){let session;try{session=unseal((await cookies()).get(sessionName)?.value,'session',config().secret);}catch{}
 if(!session?.accessToken)return Response.json({status:'unknown',items:[]},{status:401});
 return Response.json(await fetchBadges(session.user?.name),{headers:{'Cache-Control':'private, no-store'}});
}
