export async function onRequestPost(context) {
    return new Response(
        JSON.stringify({ v: "0.1" }),
        {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        }
    );
}