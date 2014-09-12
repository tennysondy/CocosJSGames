var startLayer = cc.Layer.extend({
	gameStart:null,
	gameSetting:null,
	gameOver:null,

	ctor:function () {
//		//////////////////////////////
//		// 1. super init first
		this._super();

		//this._size = cc.Director.getInstance().getWinSize(); // 获得游戏屏幕尺寸
		
		var size = cc.winSize;
		
		this.gameStart = new cc.LabelTTF("开始游戏", "Helvetica", 100);		
		this.gameSetting = new cc.LabelTTF("游戏设置", "Helvetica",100);		
		this.gameOver = new cc.LabelTTF("结束游戏", "Helvetica", 100);
	
		//创建菜单项（MenuItem）    
		var startMenuItem = new cc.MenuItemLabel(this.gameStart, function () {
			var scene = new playScene();  
			//var tranScene= new cc.TransitionMoveInL(0.5,scene);  
			//cc.Director.getInstance().replaceScene(tranScene);
			cc.director.runScene(scene);
			}, this);
		startMenuItem.setColor(cc.color(255,0,0));

		var settingMenuItem = new cc.MenuItemLabel(this.gameSetting, function () {

		}, this);
		settingMenuItem.setColor(cc.color(255,0,0));

		var endMenuItem = new cc.MenuItemLabel(this.gameOver, function () {
			cc.log("Menu is clicked!");
			window.close();
		}, this);
		endMenuItem.setColor(cc.color(255,0,0));

		//创建游戏菜单（Menu）  
		var menu= new cc.Menu(startMenuItem, settingMenuItem, endMenuItem);
//		menu.setColor(cc.color(255,0,0));
		menu.setAnchorPoint(cc.p(0.5, 0.5));// 设置锚点 
		menu.setPosition(size.width/2, size.height/4);// 设置位置
		
		this.addChild(menu);
		startMenuItem.setAnchorPoint(cc.p(0.5, 0.5));// 设置锚点 
		startMenuItem.setPosition(10, 330);// 设置位置
		
		settingMenuItem.setAnchorPoint(cc.p(0.5, 0.5));// 设置锚点 
		settingMenuItem.setPosition(10, 180);// 设置位置
		
		endMenuItem.setAnchorPoint(cc.p(0.5, 0.5));// 设置锚点 
		endMenuItem.setPosition(10, 30);// 设置位置
		
		return true;
	}

});

var gameStartScene = cc.Scene.extend({
	startLayer:null,
	// 构造函数
	ctor: function () {
		this._super();
	},
	onEnter:function () {
		this._super();
		this.startLayer = new startLayer();
		this.addChild(this.startLayer);
	}
});
