/**
 * Created by mahai on 2018/12/20.
 * 无状态组件
 * 文章列表
 */


import React from "react";
import { Tag, Icon ,List} from 'antd';
import { Link } from  'react-router-dom';
import '../styles/list.css'

const FunListArtlice = (props) =>{
    const listData = [];
    for (let i = 0; i < props.articleList.length; i++) {
        let content = props.articleList[i].articleContent.substring(0,100);
        listData.push({
            articleId: props.articleList[i].articleId,
            articleTitle: props.articleList[i].articleTitle,
            description: '努力做好每一遍有意义的文章。',
            content: content.concat('...'),
            Marks:props.articleList[i].Marks,
        });
    }
    const IconText = ({ type, text }) => (
        <span>
        <Icon type={type} style={{ marginRight: 8 }} />
            {text}
        </span>
    );
    return(
        <div className="funlist">
            <List
                itemLayout="vertical"
                size="large"
                pagination={{
                    onChange: (page) => {
                        console.log(page);
                        props.getList(page)
                    },
                    pageSize: 20,
                }}
                dataSource={listData}
                renderItem={item => (
                    <List.Item
                        key={item.title}
                        actions={
                            [<IconText type="star-o" text="156" />,
                                <IconText type="like-o" text="156" />,
                                <IconText type="message" text="2" />]
                        }
                        extra={
                            <img
                                width={272}
                                alt="logo"
                                src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                            />
                        }
                    >
                        <List.Item.Meta
                            title={
                                <div>
                                    <Link to={"/artile/"+item.articleId}>
                                        <h1 > {item.articleTitle}</h1>
                                    </Link>
                                    {
                                        item.Marks && item.Marks.length>0 && <Icon type="tag" theme="outlined" />
                                    }
                                    {
                                        item.Marks.map((s,index)=>{
                                            return <Tag color="magenta" key = {index}>{s.markName}</Tag>
                                        })
                                    }
                                </div>

                            }
                            description={item.description}
                        />
                        {item.content}
                    </List.Item>
                )}
            />
        </div>
    )
};

export default FunListArtlice