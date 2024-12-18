import path from 'path';

export default {
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve(process.cwd(), 'landing_page'),
        filename: 'bundle.js',
    },
    watch: true,
};
