export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // 1. Cleanly parse the URL
  const urlObj = new URL(req.url, 'http://localhost');
  urlObj.searchParams.delete('...path');
  urlObj.searchParams.delete('path');

  const pathPart = urlObj.pathname.replace(/^\/api\/?/, '');
  const searchPart = urlObj.search;
  const targetUrl = `http://34.87.134.73/api/${pathPart}${searchPart}`;

  try {
    const headers = {};
    for (const [key, value] of Object.entries(req.headers)) {
      if (!['host', 'connection', 'content-length'].includes(key.toLowerCase())) {
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
    res.status(502).json({ error: 'Backend proxy error', message: err.message });
  }
}
