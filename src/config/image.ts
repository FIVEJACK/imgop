import { defaultConfig, NextConfigComplete } from 'next/dist/server/config-shared';
type ImageConfig = Partial<NextConfigComplete['images']>;

const isEnvTrue = (s: string) => { return s === 'true' || s === '1'; };
const configDefault = defaultConfig.images!;

const optimizerConfig: { strict: boolean, allowAllSize: boolean, cacheTimeSec: number } = {
  cacheTimeSec: Number(process.env.IMAGE_CACHE_TIME_SEC || 0), // Cache time for images
  allowAllSize: isEnvTrue(process.env.IMAGE_ALLOW_ALL_SIZE || ''), // Override image sizes and allow all image width
  strict: isEnvTrue(process.env.STRICT_CONVERT || ''), // Allow non-strcit to convert w to closest image values, q to between 1-100
};

const imageConfig: ImageConfig = {
  ...configDefault,
  domains: (process.env.IMAGE_DOMAINS)?.split(',') ?? configDefault.domains ?? [],
  deviceSizes: (process.env.IMAGE_DEVICE_SIZES)?.split(',').map(Number) ?? configDefault.deviceSizes ?? [],
  formats: configDefault.formats ?? ['image/webp'],
  imageSizes: (process.env.IMAGE_SIZES)?.split(',').map(Number) ?? configDefault.imageSizes ?? [],
  dangerouslyAllowSVG: isEnvTrue(process.env.IMAGE_ALLOW_SVG || ''),
  contentSecurityPolicy: (process.env.IMAGE_CSP) ?? configDefault.contentSecurityPolicy,
};

export { optimizerConfig, imageConfig };
