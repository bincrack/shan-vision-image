export async function onRequest(context) {
    const {
      request, // same as existing Worker API
      env, // same as existing Worker API
      params, // if filename includes [id] or [[path]]
      waitUntil, // same as ctx.waitUntil in existing Worker API
      next, // used for middleware or to fetch assets
      data, // arbitrary space for passing data between middlewares
    } = context;
    if (!env.PROXY_URL) {
        return new Response('Please set the PROXY_URL environment variable.', { status: 500 });
    }
    
    const target_url = new URL(env.PROXY_URL);
    const target_url_string = get_target_url_string(target_url);
    const headers = {};
    for (const [key, value] of request.headers) {
        headers[key] = value;
    }

    headers['host'] = target_url.host;
    headers['origin'] = target_url.origin;

    // console.log(headers)

    const url = new URL(request.url);
    const target_url_full_url = `${target_url_string.slice(0,target_url_string.length - 1)}${url.pathname}${url.search}`;
    const response = await fetch(target_url_full_url, {
      method: request.method,
      headers,
      body: request.body,
      keepalive: false,
    });

    return response;
}

function get_target_url_string(target_url) { 
    const target_url_array = [
        target_url.protocol,
        '//',
    ];

    if (target_url.username && target_url.password) {
        target_url_array.push(target_url.username);
        target_url_array.push(':');
        target_url_array.push(target_url.password);
        target_url_array.push('@');
    }

    target_url_array.push(target_url.host);
    if (target_url.port) {
        target_url_array.push(':');
        target_url_array.push(target_url.port);
    }

    target_url_array.push(target_url.pathname);

    const target_url_string = target_url_array.join('');

    return target_url_string;
}