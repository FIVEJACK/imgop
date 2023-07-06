import { Pixel } from '@millihq/pixel-core';
import { imageConfig, optimizerConfig } from 'Config/image';
import { UrlWithParsedQuery } from 'url';
import ReturnObject from 'Helpers/return-object';
import { IncomingMessage } from 'http';
import { nodeFetchWithRetry } from 'Helpers/fetch-helper';
import { appConfig } from 'Config/app';

// We use request to detect headers for polymorph transform, eg: webp for modern browser, jpg for old browser
export const imageOptimizer = async (parsedUrl: UrlWithParsedQuery, req?: IncomingMessage) => {
  req = req || { headers: {} } as IncomingMessage;
  const toReturn = new ReturnObject;
  toReturn.setCSP(imageConfig.contentSecurityPolicy || 'default-src *;');

  const image = validateImageUrl(parsedUrl);
  if (image.error) {
    toReturn.setToFailed();
    toReturn.setData({ message: image.message });
  } else {
    const pixel = new Pixel({
      async requestHandler(_req, res) {
        const imageBuffer = await fetchImage(image.url);
        if (imageBuffer.ok) res.write(imageBuffer);
        res.end();
      },
      imageConfig: {
        ...imageConfig,
        imageSizes: optimizerConfig.allowAllSize ? [image.width] : imageConfig.imageSizes,
        loader: 'default',
      },
    });

    const newImage = await (pixel.imageOptimizer(req, {} as any, image.parsedUrl));

    if ('error' in newImage) {
      toReturn.setToFailed();
      toReturn.setData({ message: newImage.error });
    } else {
      toReturn.setContentType(newImage.contentType);
      toReturn.setContentLength(newImage.buffer.byteLength);
      toReturn.setCache(optimizerConfig.cacheTimeSec);
      toReturn.setData({ image: newImage.buffer });
    }
  }

  return toReturn;
};

const fetchImage = async (_url: string) => {
  const imageFetch = await nodeFetchWithRetry(_url, appConfig.fetchRetry, { timeout: appConfig.fetchTimeout });

  let upstreamBuffer;
  if (imageFetch?.ok) {
    upstreamBuffer = Buffer.from(await imageFetch.arrayBuffer());
  }

  return {
    ok: imageFetch?.ok,
    status: imageFetch?.status,
    buffer: upstreamBuffer,
  };
};

const validateImageUrl = (_url: UrlWithParsedQuery) => {
  const defaultSize = 256, defaultQuality = 75;
  const image = {
    parsedUrl: _url,
    url: _url?.query?.url + '',
    width: Number(_url?.query?.w || defaultSize),
    quality: Number(_url?.query?.q || defaultQuality),
    error: false,
    message: '',
  };
  const checkSizes = (imageConfig?.imageSizes || []).concat(imageConfig?.deviceSizes || []);

  if (optimizerConfig.strict) {
    if (optimizerConfig.allowAllSize && checkSizes.indexOf(image.width) === -1) {
      image.error = true;
      image.message = 'Invalid `w` parameter, value must be in [' + checkSizes.toString() + ']';
    } else if (image.quality < 0 || image.quality > 100) {
      image.error = true;
      image.message = 'Invalid `q` parameter, value must be between 0-100';
    }
  } else {
    //Width check - set to closest allowable image size
    image.width = checkSizes.reduce(function(prev, curr) {
      return (Math.abs(curr - image.width) < Math.abs(prev - image.width) ? curr : prev);
    }) || defaultSize;

    //Quality check - set quality to betqeen 0 - 100
    image.quality = Math.min(100, Math.max(0, image.quality));

    image.parsedUrl.query = {
      url: image.url,
      w: image.width + '',
      q: image.quality + '',
    };
  }

  return image;
};
