import http, { IncomingMessage, ServerResponse } from 'http';
import { appConfig } from 'Config/app';
import url, { parse as parseUrl } from 'url';
import { imageOptimizer } from 'Helpers/image-optimizer';

const reqListener = async (req: IncomingMessage, res: ServerResponse) => {
  const pathname = url.parse(req.url || '').pathname;

  if (pathname === '/img') {
    const parsedUrl = parseUrl(req.url!, true);
    const imgResult = await imageOptimizer(parsedUrl, req);

    if (imgResult.success) {
      res.writeHead(imgResult.statusCode, imgResult.getHeader());
      res.end(imgResult.data.image);
    } else {
      res.writeHead(imgResult.statusCode, imgResult.getHeader());
      res.write(JSON.stringify(imgResult.data));
      res.end();
    }
  } else {
    res.writeHead(404);
    res.end();
  }
};

const server = http.createServer();
server.on('request', async (req, res) => {
  await reqListener(req, res);
});

server.listen(appConfig.httpPort);
// eslint-disable-next-line no-console
console.log(`Server running on port ${appConfig.httpPort}`);

export default server;
