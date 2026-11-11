export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const urlObj = new URL(req.url, 'http://localhost');

  // match is passed from vercel rewrite: /api/:match* -> /api/proxy?match=:match*
  const matchParam = urlObj.searchParams.get('match');
  urlObj.searchParams.delete('match');
  urlObj.searchParams.delete('...path');
  urlObj.searchParams.delete('path');

  let targetPath = '';
  if (matchParam !== null && matchParam !== undefined) {
    targetPath = matchParam;
  } else {
    targetPath = urlObj.pathname.replace(/^\/api\/?/, '').replace(/^proxy\/?/, '');
  }

  // Remove leading slash if any
  targetPath = targetPath.replace(/^\/+/, '');

  const searchPart = urlObj.search; // Contains all original query parameters
  const targetUrl = `http://34.87.134.73/api/${targetPath}${searchPart}`;

  try {
    const headers = {};
    for (const [key, value] of Object.entries(req.headers)) {
      if (!['host', 'connection'].includes(key.toLowerCase())) {
        headers[key] = value;
      }
    }

    const fetchOptions = {
      method: req.method,
      headers,
      redirect: 'manual',
    };

    if (!['GET', 'HEAD'].includes(req.method)) {
      fetchOptions.body = req;
      fetchOptions.duplex = 'half';
    }

    const response = await fetch(targetUrl, fetchOptions);

    res.status(response.status);
    response.headers.forEach((val, key) => {
      if (!['content-encoding', 'transfer-encoding'].includes(key.toLowerCase())) {
        res.setHeader(key, val);
      }
    });

    const arrayBuf = await response.arrayBuffer();
    res.send(Buffer.from(arrayBuf));
  } catch (err) {
    res.status(502).json({ error: 'Backend proxy error', message: err.message, targetUrl });
  }
}
