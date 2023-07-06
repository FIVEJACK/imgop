import { parse as parseUrl } from 'url';
import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { IncomingMessage } from 'http';
import { imageOptimizer } from 'Helpers/image-optimizer';

const logResut = (toReturn: any, params: any, unixTimeDiff: number) => {
  const toReturnBody: string = toReturn['body'];

  console.log({
    'Optimize (ms)': unixTimeDiff,
    'Status Code': toReturn['statusCode'],
    'Body (50 char)': toReturnBody?.slice(0, 50),
    'Base64 Encoded': toReturn['isBase64Encoded'],
    'header': toReturn['headers'],
    'params': params
  })
}

export const server = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyStructuredResultV2> => {
  const parsedUrl = parseUrl(`/?${event.rawQueryString}`!, true);
  const req = { headers: event.headers } as IncomingMessage;
  const startTime = new Date();
  const imgResult = await imageOptimizer(parsedUrl, req);
  const endTime = new Date();

  const toReturn = { statusCode: imgResult.statusCode,
    body: '',
    isBase64Encoded: false,
    headers: imgResult.getHeader() };

  if (imgResult.success) {
    toReturn.body = (imgResult.data.image).toString('base64');
    toReturn.isBase64Encoded = true;
  } else {
    toReturn.body = JSON.stringify(imgResult.data);
  }

  const optimizingDuration = endTime.getTime() - startTime.getTime();
  logResut(toReturn, parsedUrl, optimizingDuration);
  return toReturn;
};

export default server;
