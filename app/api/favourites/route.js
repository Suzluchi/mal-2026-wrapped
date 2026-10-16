import {cookies} from 'next/headers';
import {config,sessionName,unseal} from '../../../lib/auth.mjs';
import {fetchFavourites} from '../../../lib/favourites.mjs';
export const dynamic='force-dynamic';
export async function GET(){
 let session;try{session=unseal((await cookies()).get(sessionName)?.value,'session',config().secret);}catch{}
 if(!session?.accessToken)return Response.json({status:'unknown',items:[]},{status:401});
 return Response.json(await fetchFavourites(session.user?.name),{headers:{'Cache-Control':'private, no-store'}});
}
