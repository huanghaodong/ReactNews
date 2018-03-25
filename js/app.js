var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
//解构React对象以及ReactDOM对象
var Component = React.Component;
var render = ReactDOM.render;
//定义工具
// 定义工具对象，实现异步请求方法
var Util = {
    /***
     * 实现ajax方法
     * @url 	请求地址
     * @fn 		请求成功回调函数
     **/
    ajax: function (url, fn) {
        // 创建xhr对象
        var xhr = new XMLHttpRequest();
        // 注册事件
        xhr.onreadystatechange = function () {
            // 判断状态
            if (xhr.readyState === 4) {
                // 判断状态码
                if (xhr.status === 200) {
                    // 解析返回的结果，执行回调函数
                    var res = JSON.parse(xhr.responseText);
                    fn && fn(res);
                }
            }
        };
        // 打开请求
        xhr.open('GET', url, true);
        // 发送数据
        xhr.send(null);
    },
    /**
     * 对象转化成query
     * @obj 	转化的对象
     * return 	query数据
     * eg: {color: "red", title: 'ickt'} => ?color=red&title=ickt
     **/
    objToQuery: function (obj) {
        // 定义结果
        var result = '';
        // 遍历对象
        for (var i in obj) {
            // key是i， value是obj[i]
            result += '&' + i + '=' + obj[i];
        }
        // 删除第一个&符号，添加?
        return '?' + result.slice(1);
    }
};
//创建Home组件
var Home = (function (_super) {
    __extends(Home, _super);
    function Home() {
        _super.apply(this, arguments);
    }
    //点击li事件
    Home.prototype.clickLi = function (id) {
        this.props.HomeToChangeSection(id);
    };
    //生成banner的li虚拟dom
    Home.prototype.createBannerLi = function () {
        return this.props.home.banner.map(function (obj, index) {
            return (React.createElement("li", {"key": index}, React.createElement("img", {"src": obj.img, "alt": ""}), React.createElement("p", null, obj.title)));
        });
    };
    //生成list的虚拟dom
    Home.prototype.createLi = function () {
        var _this = this;
        return this.props.home.list.map(function (obj, index) {
            return (React.createElement("li", {"key": index, "onClick": _this.clickLi.bind(_this, obj.id)}, React.createElement("a", null, React.createElement("span", {"className": "img-span"}, React.createElement("img", {"src": obj.img, "alt": ""})), React.createElement("div", null, React.createElement("p", null, obj.title), React.createElement("span", null, obj.source), React.createElement("span", {"className": "eyes"}, obj.comment)))));
        });
    };
    Home.prototype.render = function () {
        return (React.createElement("div", {"className": "home"}, React.createElement(Header, null), React.createElement("div", {"id": "banner", "ref": "banner"}, React.createElement("ul", null, this.createBannerLi())), React.createElement("ul", {"className": "list"}, this.createLi())));
    };
    Home.prototype.componentDidUpdate = function () {
        new bannerTouchMove(this.refs.banner, 4);
    };
    return Home;
})(Component);
//创建Detail组件
var Detail = (function (_super) {
    __extends(Detail, _super);
    function Detail() {
        _super.apply(this, arguments);
    }
    //点击更多评论事件
    Detail.prototype.clickMore = function (id) {
        this.props.DetailToChangeSection(id);
    };
    Detail.prototype.createLi = function () {
        return this.props.detail.comment.map(function (obj, index) {
            return (React.createElement("li", {"key": index}, React.createElement("span", {"className": "user"}, obj.name), React.createElement("span", {"className": "time"}, obj.time), React.createElement("span", {"className": "heart"}, obj.suport), React.createElement("p", null, obj.says)));
        });
    };
    Detail.prototype.render = function () {
        var content = {
            __html: this.props.detail.content
        };
        return (React.createElement("div", {"className": "detail"}, React.createElement(SubHeader, null), React.createElement("div", {"className": "title clearfix"}, React.createElement("h1", null, this.props.detail.title), React.createElement("span", {"className": "source"}, this.props.detail.source), React.createElement("span", {"className": "time"}, this.props.detail.time)), React.createElement("div", {"className": "big-img"}, React.createElement("img", {"src": this.props.detail.img, "alt": ""})), React.createElement("div", {"className": "content", "dangerouslySetInnerHTML": content}), React.createElement("span", {"className": "auther"}, "作者：", this.props.detail.auther), React.createElement("div", {"className": "share"}, React.createElement("span", null, "分享到"), React.createElement("div", {"className": "share-to"}, React.createElement("a", {"href": ""}, React.createElement("img", {"src": "img/images/01.png", "alt": ""})), React.createElement("a", {"href": ""}, React.createElement("img", {"src": "img/images/02.png", "alt": ""})), React.createElement("a", {"href": ""}, React.createElement("img", {"src": "img/images/03.png", "alt": ""})), React.createElement("a", {"href": ""}, React.createElement("img", {"src": "img/images/04.png", "alt": ""})), React.createElement("a", {"href": ""}, React.createElement("img", {"src": "img/images/05.png", "alt": ""})))), React.createElement("div", {"className": "cmt"}, React.createElement("div", {"className": "cmt-title"}, React.createElement("div", {"className": "line"}), React.createElement("span", null, "评论区")), React.createElement("ul", {"className": "cmt-list"}, this.createLi()), React.createElement("div", {"className": "cmt-more", "onClick": this.clickMore.bind(this, this.props.detail.id)}, "查看更多评论/我要评论"))));
    };
    return Detail;
})(Component);
//创建Comment组件
var Comment = (function (_super) {
    __extends(Comment, _super);
    //在构造函数中初始化状态
    function Comment(props) {
        _super.call(this, props);
        this.state = {
            list: props.comment.list,
            id: props.comment.id
        };
    }
    //在存在期第一个阶段 用属性更新状态
    Comment.prototype.componentWillReceiveProps = function (props) {
        this.setState({
            list: props.comment.list,
            id: props.comment.id
        });
    };
    //点击发布消息事件回调函数
    Comment.prototype.broadcastComment = function () {
        var _this = this;
        var text = this.refs.inputText.value;
        //输入验证 非空
        if (/^\s*$/.test(text)) {
            alert('请输入评论内容哦~');
            return;
        }
        //拼凑提交的数据
        var date = new Date();
        var result = {
            name: '雨夜清荷',
            says: text,
            // "昨天 22:38:28"
            time: '刚刚: ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
            suport: 75
        };
        result.id = this.state.id;
        //发送请求
        $.get('data/addComment.json', result, function (res) {
            if (res && res.errno === 0) {
                //将这条数据直接放入state.list，一起渲染
                var list = _this.state.list;
                list.push(result);
                _this.setState({
                    list: list
                });
                //清空输入框
                _this.refs.inputText.value = '';
                alert('恭喜您，提交成功！');
            }
        });
    };
    //生成cmt-list的虚拟dom li
    Comment.prototype.createLi = function () {
        return this.state.list.map(function (obj, index) {
            return (React.createElement("li", {"key": index}, React.createElement("span", {"className": "user"}, obj.name), React.createElement("span", {"className": "time"}, obj.time), React.createElement("span", {"className": "heart"}, obj.suport), React.createElement("p", null, obj.says)));
        });
    };
    Comment.prototype.render = function () {
        return (React.createElement("div", {"className": "comment"}, React.createElement(ThirdHeader, {"CommentBackToDetail": this.props.CommentBackToDetail}), React.createElement("div", {"className": "cmt"}, React.createElement("div", {"className": "comment-box"}, React.createElement("textarea", {"name": "", "id": "", "ref": "inputText"}), React.createElement("button", {"onClick": this.broadcastComment.bind(this)}, "发表评论")), React.createElement("div", {"className": "cmt-title"}, React.createElement("div", {"className": "line"}), React.createElement("span", null, "评论区")), React.createElement("ul", {"className": "cmt-list"}, this.createLi()))));
    };
    return Comment;
})(Component);
//创建Header组件
var Header = (function (_super) {
    __extends(Header, _super);
    function Header() {
        _super.apply(this, arguments);
    }
    Header.prototype.render = function () {
        return (React.createElement("div", {"className": "header"}, React.createElement("a", {"href": "", "className": "login"}), React.createElement("a", {"href": "", "className": "message"}), React.createElement("a", {"href": "", "className": "load"})));
    };
    return Header;
})(Component);
//创建SubHeader
var SubHeader = (function (_super) {
    __extends(SubHeader, _super);
    function SubHeader() {
        _super.apply(this, arguments);
    }
    SubHeader.prototype.render = function () {
        return (React.createElement("div", {"className": "sub-header"}, React.createElement("a", {"href": "/", "className": "nelogo"}), React.createElement("a", {"className": "link"})));
    };
    return SubHeader;
})(Component);
//创建ThirdHeader
var ThirdHeader = (function (_super) {
    __extends(ThirdHeader, _super);
    function ThirdHeader() {
        _super.apply(this, arguments);
    }
    ThirdHeader.prototype.back = function () {
        this.props.CommentBackToDetail();
    };
    ThirdHeader.prototype.render = function () {
        return (React.createElement("div", {"className": "sub-header"}, React.createElement("a", {"className": "arrow", "onClick": this.back.bind(this)}, React.createElement("i", null)), React.createElement("a", {"className": "link"})));
    };
    return ThirdHeader;
})(Component);
//创建父组件
var App = (function (_super) {
    __extends(App, _super);
    //构造函数
    function App(props) {
        //super关键字，它指代父类的实例（即父类的this对象）。子类必须在constructor方法中调用super方法，否则新建实例时会报错。ES6的继承机制，实质是先创造父类的实例对象this（所以必须先调用super方法），然后再用子类的构造函数修改this。
        _super.call(this, props);
        //初始化状态
        this.state = {
            section: props.section,
            home: {
                banner: [],
                list: []
            },
            detail: {
                comment: []
            },
            comment: {
                list: [],
                id: ''
            }
        };
    }
    App.prototype.render = function () {
        return (React.createElement("div", null, React.createElement("div", {"style": { display: this.state.section === 'home' ? 'block' : 'none' }}, React.createElement(Home, {"home": this.state.home, "HomeToChangeSection": this.HomeToChangeSection.bind(this)})), React.createElement("div", {"style": { display: this.state.section === 'detail' ? 'block' : 'none' }}, React.createElement(Detail, {"detail": this.state.detail, "DetailToChangeSection": this.DetailToChangeSection.bind(this)})), React.createElement("div", {"style": { display: this.state.section === 'comment' ? 'block' : 'none' }}, React.createElement(Comment, {"comment": this.state.comment, "CommentBackToDetail": this.CommentBackToDetail.bind(this)}))));
    };
    //父组件一创建完成就向Home组件发送数据
    App.prototype.componentDidMount = function () {
        var _this = this;
        $.get('data/list.json', function (res) {
            console.log(222);
            if (res && res.errno === 0) {
                _this.setState({
                    home: res.data
                });
            }
        });
    };
    //Home组件给父组件传递信息方法 改变父组件状态对象的section值为detail，然后父组件切换子组件的显隐
    App.prototype.HomeToChangeSection = function (id) {
        var _this = this;
        $.get('data/detail.json?id=' + id, function (res) {
            if (res && res.errno === 0) {
                _this.setState({
                    section: 'detail',
                    detail: res.data
                });
            }
        });
    };
    //Detail组件传给父信息方法
    App.prototype.DetailToChangeSection = function (id) {
        var _this = this;
        $.get('data/comment.json?id=' + id, function (res) {
            if (res && res.errno === 0) {
                _this.setState({
                    section: "comment",
                    comment: res.data
                });
            }
        });
    };
    //Comment组件点击返回返回到Deatail
    App.prototype.CommentBackToDetail = function () {
        this.setState({
            section: "detail"
        });
    };
    return App;
})(Component);
//渲染到页面
render(React.createElement(App, {"section": "home"}), document.getElementById('app'));
