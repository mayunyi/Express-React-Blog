/**
 * 首頁菜單
 * */

import React from "react";
import { Link } from 'react-router-dom';
import '../styles/index.css';



export default function LinkMeum () {
    return (
        <div className='routerDiv'>
            <Link to='/'><div className='routerLink fistLink'>首页</div></Link>
            <Link to='/artlicelist'><div className='routerLink'>文章</div></Link>
            <Link to='/pigeonhole'><div className='routerLink'>归档</div></Link>
            <Link to='/about'><div className='routerLink'>关于</div></Link>
        </div>
    )
}


// export default class LinkMeum extends Component{
//     constructor(props,context){
//         super(props,context);
//     }
//
//     render() {
//         return (
//             <div className='routerDiv'>
//                 <Link to='/'><div className='routerLink fistLink'>首页</div></Link>
//                 <Link to='/artlicelist'><div className='routerLink'>文章</div></Link>
//                 <Link to='/admin'><div className='routerLink'>归档</div></Link>
//                 <Link to='/about'><div className='routerLink'>关于</div></Link>
//             </div>
//         )
//     }
// }
