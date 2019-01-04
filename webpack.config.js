



module.exports = function (env) {
	let webpackName = 'dev'; 
	if(env === 'production'){
		webpackName = 'prod';
	}
    // 根据环境参数动态决定引入对应配置文件
    return require (`./config/webpack.${webpackName}.js`)({
        env
    });
};
