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
        listData.push({
            id: props.articleList[i]._id,
            articleTitle: props.articleList[i].Title,
            description: props.articleList[i].dec,
            content: props.articleList[i].content,
            fengImg: props.articleList[i].img,
            likenum:props.articleList[i].likenum,
            messnum:props.articleList[i].messnum,
            upnum:props.articleList[i].upnum,
            tags:props.articleList[i].extra_params.tagsData,
            writer:props.articleList[i].writer,
            writerId:props.articleList[i].writerId,
            date:props.articleList[i].date,
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
                        props.getList(page,20)
                    },
                    pageSize: 20,
                    total:props.toatl
                }}
                dataSource={listData}
                renderItem={item => (
                    <List.Item
                        key={item.id}
                        actions={
                            [
                                <IconText type="star-o" text={item.likenum} />,
                                <IconText type="like-o" text={item.upnum} />,
                                <IconText type="message" text={item.messnum} />
                            ]
                        }
                        extra={
                            <img
                                width={150}
                                height={150}
                                alt="logo"
                                src={item.fengImg}
                            />
                        }
                    >
                        <List.Item.Meta
                            title={
                                <div>
                                    <Link to={"/artile/"+item.id}>
                                        <h1 > {item.articleTitle}</h1>
                                    </Link>
                                    {
                                        item.tags && item.tags.length>0 && <Icon type="tag" theme="outlined" />
                                    }
                                    {
                                        item.tags.map((s,index)=>{
                                            return <Tag color="magenta" key = {index}>{s.name}</Tag>
                                        })
                                    }
                                </div>

                            }
                            //description={item.description}
                        />
                        {item.description}
                    </List.Item>
                )}
            />
        </div>
    )
};

export default FunListArtlice