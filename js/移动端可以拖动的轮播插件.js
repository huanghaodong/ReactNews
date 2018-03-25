/***
*@selecter指向作为ul父元素的div选择器
*@imgLength表示图片数量
*设备宽度=div宽度=ul宽度=li宽度=img宽度
*
*
*
*
*
**********/
function bannerTouchMove (selecter,imgLength){
	this.num = 0;
	this.deviceWidth = $(window).width();
	this.el = $(selecter);
	this.imgLength = imgLength-1;
	//保存初始点击位置的变量
	this.startX = 0;
	//节流变量
	this.lock = true;
	this.init();
}
bannerTouchMove.prototype = {
		init : 	function(){
			var that = this;
				this.el.on('touchstart',function(e){that.startTouch.call(that,e)})
				this.el.on('touchmove',function(e){that.moveTouch.call(that,e)})
				this.el.on('touchend',function(e){that.endTouch.call(that,e)})

	},
	startTouch : function(e){
				if(!this.lock) return;
				//console.log(e)
				this.startX = e.changedTouches[0].clientX;
				
			},
	moveTouch : function(e){
		
				if(!this.lock) return;
				var instance =   e.changedTouches[0].clientX - this.startX;
				//向右滑
				if(instance>0){
					var shortNum = this.num-1 < 0 ? this.imgLength : this.num-1 ;
					this.el.find('ul li').eq(shortNum).css({'left':-this.deviceWidth+'px','opacity':1});
					this.el.find('ul').css('left',instance + 'px');
				//向左滑
				}else{
					var shortNum = this.num+1 > this.imgLength ? 0 : this.num+1 ;
					this.el.find('ul li').eq(shortNum).css({'left':this.deviceWidth+'px','opacity':1});
					this.el.find('ul').css('left',instance + 'px');
				}
				
				
			},
	endTouch : function(e){
				if(!this.lock) return;
				if( e.changedTouches[0].clientX - this.startX > 80){
					this.num = --this.num < 0 ? this.imgLength : this.num ;
					this.move(this.num);
				}else if( e.changedTouches[0].clientX - this.startX < -80){
					this.num = ++this.num > this.imgLength ? 0 : this.num ;
					this.move(this.num,true);
				}else{
					this.comeBack()
				}
			},
	//定义大图ul动一格的方法
			/*
			*num表示图片索引值
			*如果left为true向左滑，否则向右滑动
			*
			***/
	move : function(num,left){
				if(!this.lock) return;
				this.lock = false;
				var i = left? 1 : -1;
				var that = this;
				this.el.find('ul').animate({'left' : -i*that.deviceWidth + 'px'},500,function(){
				that.el.find('ul').css('left', 0);
				that.el.find('ul li').eq(num).css({'left':0,'opacity':1}).siblings().css('opacity',0);
					//开锁
					that.lock = true;
				})
			},
			//移动距离不足，回到原处
	comeBack : function (){
				var that = this;
				this.el.find('ul').animate({'left':0},500,function(){
					//开锁
					that.lock = true;
				});
				
			}	
}