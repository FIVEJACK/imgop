/* eslint-disable @typescript-eslint/naming-convention */
export enum HTTP_CODES {
  NOT_ACCEPTABLE = 406,
  FORBIDDEN = 403,
  SUCCESS = 200,
  SERVER_ERROR = 500
}

export default class ReturnObjectHelper {
  public success: boolean;
  public data: {[key: string]: any};
  public statusCode: HTTP_CODES;
  public contentType: string;
  public cacheControl: string;
  public contentLength: number;
  public csp: string;
  public defaultCacheTTL = 60 * 60 * 12; // 12 hours

  public constructor(data: object = {}, success: boolean = true, statusCode?: HTTP_CODES) {
    this.success = success;
    this.data = data;
    this.statusCode = statusCode || HTTP_CODES.SUCCESS;
    this.contentType = 'application/json';
    this.csp = 'default-src *';
    this.contentLength = 0;
    this.cacheControl = `public, max-age=${this.defaultCacheTTL}`;
  }

  public setCache(cacheSec: number) {
    this.cacheControl = `public, max-age=${cacheSec >= 0 ? cacheSec : this.defaultCacheTTL}`;
    return this;
  }

  public setToFailed(statusCode: HTTP_CODES = HTTP_CODES.NOT_ACCEPTABLE) {
    this.success = false;
    this.data = {};
    this.statusCode = statusCode;
    return this;
  }

  public setToError(statusCode: HTTP_CODES = HTTP_CODES.SERVER_ERROR) {
    this.success = false;
    this.data = {};
    this.statusCode = statusCode;
    return this;
  }

  public setData(data: object = {}) {
    this.data = data;
    return this;
  }

  public setStatusCode(statusCode: HTTP_CODES) {
    this.statusCode = statusCode;
    return this;
  }

  public setContentType(_contentType: string) {
    this.contentType = _contentType;
    return this;
  }

  public setCSP(_csp: string) {
    this.csp = _csp;
    return this;
  }

  public setContentLength(_contentLength: number) {
    this.contentLength = _contentLength;
    return this;
  }

  public getHeader() {
    const headers = { vary: 'Accept',
      'access-control-allow-origin': '*',
      'content-type': this.contentType,
      'cache-control': this.cacheControl,
      'content-security-policy': this.csp } as any;

    if (this.contentLength > 0) {
      headers['content-length'] = this.contentLength;
    }

    return headers;
  }
}
