/**
 * 文章列表组件
 * */

import React from "react";
import '../styles/index.css';

const Fragment = React.Fragment;
export default function SVG () {
    return (
        <Fragment >
            <svg className='svg' version="1.1" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
                <symbol id="text">
                    <text x="15%" y="35%" className="text">马云逸</text>
                    <text x="30%" y="70%" className="text">博客</text>
                </symbol>
                <g>
                    <use xlinkHref="#text" className="use-text"/>
                    <use xlinkHref="#text" className="use-text"/>
                    <use xlinkHref="#text" className="use-text"/>
                    <use xlinkHref="#text" className="use-text"/>
                    <use xlinkHref="#text" className="use-text"/>
                </g>
            </svg>
        </Fragment>
    )
}

