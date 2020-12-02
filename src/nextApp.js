export default function (config) {
    const prod = process.env.NODE_ENV === 'production'
    const currentPath = process.cwd();

    const {PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_SERVER} = require('next/constants');
    const withPlugins = require('next-compose-plugins');
    const withSourceMaps = require('@zeit/next-source-maps');
    const bundleAnalyzer = require('@next/bundle-analyzer');
    const withOptimizedImages = require('next-optimized-images');
    const withOffline = require('next-offline');
    const withGraphql = require('next-plugin-graphql');
    const progressBar = require('@ttungbmt/next-progressbar')
    const {Signale} = require('signale');
    const packageJson = require(currentPath + '/package');

    const signale = new Signale();
    const date = new Date();

    /*
    * https://github.com/UnlyEd/next-right-now/blob/v2-mst-aptd-at-lcz-sty/next.config.js
    * https://github.com/lucleray/next-progressbar/blob/master/index.js
    * */

    signale.info(`Building Next with NODE_ENV="${process.env.NODE_ENV}" NEXT_PUBLIC_APP_STAGE="${process.env.NEXT_PUBLIC_APP_STAGE}""`);

    const nextConfig = {
        serverRuntimeConfig: {},
        publicRuntimeConfig: {},
        env: {
            NEXT_PUBLIC_APP_BUILD_TIME: date.toString(),
            NEXT_PUBLIC_APP_BUILD_TIMESTAMP: +date,
            NEXT_PUBLIC_APP_NAME: packageJson.name,
            NEXT_PUBLIC_APP_VERSION: packageJson.version,
            NEXT_PUBLIC_APP_NAME_VERSION: `${packageJson.name}-${packageJson.version}`,
        },
        async headers() {
            const headers = [];

            signale.info('Using headers:', headers);

            return headers;
        },

        async rewrites() {
            const rewrites = [];

            signale.info('Using rewrites:', rewrites);

            return rewrites;
        },

        async redirects() {
            const redirects = [];

            signale.info('Using redirects:', redirects);

            return redirects;
        },

        webpack: (config, {buildId, dev, isServer, defaultLoaders}) => {
            if (isServer) {
                // IS_SERVER_INITIAL_BUILD is meant to be defined only at build time and not at run time, and therefore must not be "made public"
                process.env.IS_SERVER_INITIAL_BUILD = '1';
            }

            const APP_VERSION_RELEASE = `${packageJson.version}_${buildId}`;

            if (isServer) { // Trick to only log once
                console.debug(`\n[webpack] Building release "${APP_VERSION_RELEASE}" using NODE_ENV="${process.env.NODE_ENV}" ${process.env.IS_SERVER_INITIAL_BUILD ? 'with IS_SERVER_INITIAL_BUILD="1"' : ''}`);
            }

            // Fixes npm packages that depend on `fs` module
            config.node = {
                fs: 'empty',
            };

            if (!isServer) {

            }

            return config;
        },

        // poweredByHeader: false
    }

    const plugins = [
        withSourceMaps,
        [bundleAnalyzer({enabled: process.env.ANALYZE_BUNDLE === 'true'})],
        progressBar(),
        withOptimizedImages,
        withOffline,
        withGraphql
    ]


    return {
        config: nextConfig,
        plugins
    }
}