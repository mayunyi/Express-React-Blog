/**
 * 文章列表组件
 * */

import React from "react";
import LinkMeum from '../components/LinkMeum'
import SVG from '../components/SVG'
import '../styles/index.css';

const Fragment = React.Fragment;
export default function HomeIndex () {
    return (
        <Fragment >
            <SVG/>
            <LinkMeum/>
        </Fragment>
    )
}

// export default class HomeIndex extends Component{
//     constructor(props,context){
//         super(props,context);
//     }
//
//     render() {
//         return (
//             <div >
//                 <SVG/>
//                 <LinkMeum/>
//             </div>
//         )
//     }
// }
