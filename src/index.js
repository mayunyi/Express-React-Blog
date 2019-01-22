
import App from './App';
import React from 'react';
import './style.css';
import  './static/iconFont/iconfont.css';
import ReactDOM from 'react-dom';
//全局配置antd使用中文
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

ReactDOM.render(<LocaleProvider locale={zh_CN}><App /></LocaleProvider>, document.getElementById('root'));
