# Image Optimizer

Image optimization component based on nextjs image loader. It can use http server or cloud function

## Basic dependencies
Make sure you have these installed in your computer for development
1. Node.js
2. Yarn (or npm)

## How to Configure
1. run `yarn install` to install dependencies
2. copy .env.example to .env and set your local environment there
3. run `yarn start`, and depending on your .env it will serve on http or cloudfunction, default will be served on localhost:7000

## Usage
Access the server `{HOSt}:{PORT}/img?w={WIDTH}&q={QUALITY}&url={SOURCE_URL}`

Host and port is the server, default is localhost:7000
Width and quality the optimized result, based on your env, it will throw an error if it is not in the .env
Url is the source of original email, it will throw an error if domains not added to the .env

For serving the app, update the .env with `SERVER=http` or `SERVER=lambda`

## Nextjs Image Loader

To use this, start the imgop server, and update your nextjs image loader configuration in next.config.js to the app url

```
module.exports = {
  ...
  images: { path: '{HOST}:{PORT}/img' },
  ...
}
```

## Deployment

Running `yarn build && yarn bundle` will generate build.zip file containing .js file with all the necessary node_modules  

## License

Apache-2.0

Forked from: https://github.com/milliHQ/terraform-aws-next-js-image-optimization