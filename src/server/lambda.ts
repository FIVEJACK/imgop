require('@/bootstrap');
import { parse as parseUrl } from 'url';
import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { IncomingMessage } from 'http';
import { imageOptimizer } from 'Helpers/image-optimizer';

const server = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyStructuredResultV2> => {
  const parsedUrl = parseUrl(`/?${event.rawQueryString}`!, true);
  const req = { headers: event.headers } as IncomingMessage;
  const imgResult = await imageOptimizer(parsedUrl, req);
  const toReturn = { statusCode: imgResult.statusCode,
    body: '',
    isBase64Encoded: true,
    headers: imgResult.getHeader() };

  if (imgResult.success) {
    toReturn.body = imgResult.data.image;
    toReturn.isBase64Encoded = true;
  } else {
    toReturn.body = JSON.stringify(imgResult.data);
  }

  return toReturn;
};

export default server;
