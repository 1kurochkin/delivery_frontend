const CracoLessPlugin = require('craco-less');

module.exports = {
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: {
                            // Layout
                            'layout-body-background': 'white',
                            'font-family': ''
                        },
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
};