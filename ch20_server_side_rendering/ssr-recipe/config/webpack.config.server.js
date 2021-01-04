const nodeExternals = require('webpack-node-externals');
const paths = require('./paths');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent'); // CSS Moduel의 고유 className을 만들 때 필요한 옵션
const webpack = require('webpack');
const getClientEnvironment = require('./env');

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const publicUrl = paths.servedPath.slice(0, -1);
const env = getClientEnvironment(publicUrl);

module.exports = {
	mode: 'production', // 프로덕션 모드로 설정하여 최적화 옵션들을 활성화
	entry: paths.ssrIndexJs, // 엔트리 경로
	target: 'node', // node 환경에서 실행될 것이라는 점을 명시
	output: {
		path: paths.ssrBuild, // 빌드 경로
		filename: 'server.js', // 파일 이름
		chunkFilename: 'js/[name].chunk.js', // 청크 파일 이름
		publicPath: paths.servedPath, // 정적 파일이 제공될 경로
	},
	module: {
		rules: [
			{
				oneOf: [
					// 자바스크립트를 위한 처리
					// 기존 webpack.config.js를 참고하여 작성
					{
						test: /\.(js|mjs|jsx|ts|tsx)$/,
						include: paths.appSrc,
						loader: require.resolve('babel-loader'),
						options: {
							customize: require.resolve(
								'babel-preset-react-app/webpack-overrides'
							),
							presets: [
								[
									require.resolve('babel-preset-react-app'),
									{
										runtime: hasJsxRuntime ? 'automatic' : 'classic',
									},
								],
							],

							plugins: [
								[
									require.resolve('babel-plugin-named-asset-import'),
									{
										loaderMap: {
											svg: {
												ReactComponent:
													'@svgr/webpack?-svgo,+titleProp,+ref![path]',
											},
										},
									},
								],
							],
							// This is a feature of `babel-loader` for webpack (not Babel itself).
							// It enables caching results in ./node_modules/.cache/babel-loader/
							// directory for faster rebuilds.
							cacheDirectory: true,
							// See #6846 for context on why cacheCompression is disabled
							cacheCompression: false,
							compact: isEnvProduction,
						},
					},
					{
						test: cssRegex,
						exclude: cssModuleRegex,
						loader: require.resolve('css-loader'),
						options: {
							exportOnlyLocals: true,
						},
						// Don't consider CSS imports dead code even if the
						// containing package claims to have no side effects.
						// Remove this when webpack adds a warning or an error for this.
						// See https://github.com/webpack/webpack/issues/6571
						sideEffects: true,
					},
					{
						test: cssModuleRegex,
						loader: require.resolve('css-loader'),
						options: {
							modules: true,
							exportOnlyLocals: true,
							getLocalIdent: getCSSModuleLocalIdent,
						},
					},
					{
						test: sassRegex,
						exclude: sassModuleRegex,
						use: [
							{
								loader: require.resolve('css-loader'),
								options: {
									exportOnlyLocals: true,
								},
							},
							require.resolve('sass-loader'),
						],
					},
					{
						test: sassRegex,
						exclude: sassModuleRegex,
						use: [
							{
								loader: require.resolve('css-loader'),
								options: {
									modules: true,
									exportOnlyLocals: true,
									getLocalIdent: getCSSModuleLocalIdent,
								},
							},
							require.resolve('sass-loader'),
						],
					},
					// url-loader
					{
						test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
						loader: require.resolve('url-loader'),
						options: {
							emitFile: false,
							limit: 10000,
							name: 'static/media/[name].[hash:8].[ext]',
						},
					},
					{
						loader: require.resolve('file-loader'),
						// Exclude `js` files to keep "css" loader working as it injects
						// its runtime that would otherwise be processed through "file" loader.
						// Also exclude `html` and `json` extensions so they get processed
						// by webpacks internal loaders.
						exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
						options: {
							emitFile: false,
							name: 'static/media/[name].[hash:8].[ext]',
						},
					},
				],
			},
		],
	},
	resolve: {
		modules: ['node_modules'],
	},
	externals: [nodeExternals()],
	plugins: [
		new webpack.DefinePlugin(env.stringified), // 환경 변수 주입
	],
};
