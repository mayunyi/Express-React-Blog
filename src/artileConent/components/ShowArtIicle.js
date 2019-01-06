import React,{Component} from 'react';
import marked from 'marked'
import hljs from 'highlight.js'
import {Row,Col,Icon,BackTop,Spin,Avatar,Divider} from 'antd';
import MessageArtlice from "./MessageArtlice";


const Fragment = React.Fragment;


export default class ShowArticle extends Component {

	constructor(props,context){
        super(props,context);
        this.state = {
            title:'',
            writer:'',
            writerId:'',
            data:'',
            articleContent:'',
            marks:[],
            loading:false
        }
    }
    componentDidMount(){
	    this.setState({
            loading:true
        });
        let local = this.props.match.params.id;
        if(local){
            this.getIdArticle(local);
        }
        marked.setOptions({
            highlight: code => hljs.highlightAuto(code).value,
        });
    }
    getIdArticle(articleID){
        fetch(`/api/articlelist/${articleID}`).then(rep=>{
            return rep.json();
        }).then(json=>{
            this.setState({
                title:json.Title,
                writer:json.writer,
                data:json.date ? json.date.substring(0,json.date.indexOf('T')):'',
                articleContent:json.content,
                marks:json.tags,
                writerId:json.writerId,
                loading:false
            })
        })
    }

    render() {
        const  spin = {
            textAlign: 'center',
            padding: '30px 50px',
            margin: '20px 0'
        };
        return (
            <Fragment>
                {
                    this.state.loading ?
                        <div style={spin}>
                            <Spin spinning={this.state.loading} size='large' tip="数据加载中..."/>
                        </div>
                        :
                        <Fragment>
                            {/*<ArtliceMeun {...this.props} articleContent = {marked(this.state.articleContent) }/>*/}
                            <div className="articleConent">
                                <Row>
                                    <Col>
                                        <h1 className="title">{this.state.title}</h1>
                                    </Col>
                                </Row>
                                <div style = {{textAlign:'center'}}>
                                    <label>作者:</label>
                                    <strong className="data">{this.state.writer}</strong>
                                </div>
                                <div style = {{textAlign:'center'}}>
                                    <Icon type="calendar" theme="outlined" />
                                    <strong className="data">{this.state.data}</strong>
                                </div>
                                <div className='articleShow' dangerouslySetInnerHTML={{ __html: marked(this.state.articleContent)}}/>
                            </div>
                            <MessageArtlice {...this.props} writerId = {this.state.writerId}/>
                            <BackTop visibilityHeight = {50}/>
                        </Fragment>
                }
            </Fragment>

    	)
    }
}

