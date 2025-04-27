export async function onRequestPost(context) {
    const { request, env } = context;
    return new Response(
        JSON.stringify({ 
            v: "0.2",
            TG_Chat_ID: env.TG_Chat_ID,
            TG_Bot_Token: env.TG_Bot_Token
        }),
        {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        }
    );
}