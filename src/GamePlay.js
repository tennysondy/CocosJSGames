var isTouch = 0;

var Food = function(id, name, timeCount, food)  
{  
	this.id = id;  
	this.name = name; 
	this.timeCount = timeCount;
	this.food = food;
}  

var Enemy = function(id, name, timeCount, enemy)  
{  
	this.id = id;  
	this.name = name; 
	this.timeCount = timeCount;
	this.enemy = enemy;
}  

var playLayer = cc.Layer.extend({
	timer:null,
	timeCount:0,
	minute:null,
	second:null,
	millisecond:null,
	fatty:null,
	background:null,
	foodList:null,
	foodId:0,
	enemyList:null,
	enemyId:0,
	speed:500.0,
	kgLabel:null,
	kilogram:0.0,

	ctor:function () {
// //////////////////////////////
// // 1. super init first
		this._super();

		var size = cc.winSize;
		this.background = new cc.Sprite(res.Bg01_png);
		// this.boss.setColor(cc.color(0,255,0));
		this.addChild(this.background, 1); // 在gameLayer层上加载这个精灵
		this.background.setAnchorPoint(cc.p(0.5, 0.5));// 设置锚点
		this.background.setPosition(size.width/2, size.height/2);// 设置位置
		//添加计时器
		this.minute = 0;
		this.second = 0;
		this.millisecond = 0;
		this.timer = new cc.LabelTTF("00:00:00", "Consolas", 80);
		this.timer.setColor(cc.color(0,128,255));
		this.timer.setAnchorPoint(cc.p(0.5, 0.5));// 设置锚点
		this.timer.setPosition(size.width/5, size.height - 100);// 设置位置
		this.addChild(this.timer, 4);
		//添加体重计
		this.kgLabel = new cc.LabelTTF("0kg", "Consolas", 80);
		this.kgLabel.setColor(cc.color(0,128,255));
		this.kgLabel.setAnchorPoint(cc.p(0.5, 0.5));// 设置锚点
		this.kgLabel.setPosition(size.width - 300, size.height - 100);// 设置位置
		this.addChild(this.kgLabel, 5);
		//添加一个胖子
		this.fatty = new cc.Sprite(res.Boy_png);
		// this.plane.setColor(cc.color(255,0,0));
		this.fatty.setAnchorPoint(cc.p(0.5, 0.5));// 设置锚点
		this.fatty.setPosition(size.width/2, size.height/2);// 设置位置
		this.addChild(this.fatty, 3);
		if (isTouch == 1) {
			//添加鼠标响应
			cc.eventManager.addListener({
				event: cc.EventListener.TOUCH_ONE_BY_ONE,
				swallowTouches:true,
				onTouchBegan: function (touch, event) {
					var target = event.getCurrentTarget();
					target.fatty.stopAllActions();
					var tarPos = touch.getLocation(); // 获得点击位置
					var curPos = target.fatty.getPosition(); // 获得胖子位置
					//curPos= cc.pClamp(curPos, cc.POINT_ZERO, cc.p(target._size.width, target._size.height)); // 触摸范围（超出屏幕无效）
					x = tarPos.x - curPos.x;
					y = tarPos.y - curPos.y;
					var distance = Math.pow((x * x + y * y), 1/2);
					var duration = distance/target.speed;
					cc.log("distance: "+distance);
					cc.log("duration: "+duration);
					var move = cc.MoveTo.create(duration, tarPos);
					target.fatty.runAction(
							cc.sequence(
									move
							)
					);
					return true;
				},
				onTouchMoved: function(touch, event){

				},
				onTouchEnded: function(touch, event){

				}
			},this);
		} else {
			//添加鼠标响应
			cc.eventManager.addListener({
				event: cc.EventListener.MOUSE,
				onMouseMove: function(event){
					var str = "MousePosition X: " + event.getLocationX() + "  Y:" + event.getLocationY();

				},
				onMouseUp: function(event){
					var str = "Mouse Up detected, Key: " + event.getButton();
					// do something...
				},
				onMouseDown: function(event){
					var str = "Mouse Down detected, Key: " + event.getButton();
					// do something...
					if (event.getButton() === cc.EventMouse.BUTTON_LEFT)
					{
						var target = event.getCurrentTarget();
						target.fatty.stopAllActions();
						var tarPos = event.getLocation(); // 获得点击位置
						var curPos = target.fatty.getPosition(); // 获得胖子位置
						//curPos= cc.pClamp(curPos, cc.POINT_ZERO, cc.p(target._size.width, target._size.height)); // 触摸范围（超出屏幕无效）
						x = tarPos.x - curPos.x;
						y = tarPos.y - curPos.y;
						var distance = Math.pow((x * x + y * y), 1/2);
						var duration = distance/target.speed;
						cc.log("distance: "+distance);
						cc.log("duration: "+duration);
						var move = cc.MoveTo.create(duration, tarPos);
						target.fatty.runAction(
								cc.sequence(
										move
								)
						);
						//target.fatty.setPosition(tarPos);// 设定飞机新位置
					}

				},
				onMouseScroll: function(event){
					var str = "Mouse Scroll detected, X: " + event.getLocationX() + "  Y:" + event.getLocationY();
					// do something...
				}
			},this);
		}

		//添加食物
		this.foodList = new Array();

		//添加调度函数
		this.schedule(this.updateTimer, 0.1);
		this.schedule(this.addFood, 3);
		this.schedule(this.updateFood, 1);
		this.schedule(this.addEnemy, 4);
		this.schedule(this.updateEnemy, 10);
		this.schedule(this.updateGame);
		
		return true;
	},
	
	addEnemy:function(){
		var size = cc.winSize;
		//添加敌人
		if (this.enemyList == null)
			this.enemyList = new Array();
		if (this.enemyList.length >= 5) {
			return;
		}
		while (1) {
			var nameList = new Array("fire", "lightning");
			var index = Math.round((nameList.length - 1)*Math.random());
			var name = nameList[index];
			var enemy;
			switch(index)
			{
			case 0: enemy = new cc.Sprite(res.Fire01_png);break;
			case 1: enemy = new cc.Sprite(res.Lightning01_png);break;
			}
			enemy.setAnchorPoint(cc.p(0.5, 0.5));// 设置锚点
			var overlap = 1;//设置重叠标志
			while (overlap == 1) {
				overlap = 0;
				enemy.setPosition(size.width*Math.random(), size.height*Math.random());// 设置位置
				var enemyRect = enemy.getBoundingBox();
				
				var length;
				if (this.foodList == null) 
					length = 0;
				else
					length = this.foodList.length;
				for (var int = 0; int < length; int++) {
					var preFood  = this.foodList[int].food;
					var preFoodRect = preFood.getBoundingBox();
					if (cc.rectIntersectsRect(preFoodRect,enemyRect)) {
						overlap = 1;
						break;
					}
				}
				if (this.enemyList == null) 
					length = 0;
				else
					length = this.enemyList.length;
				for (var int = 0; int < length; int++) {
					var preEnemy  = this.enemyList[int].enemy;
					var preEnemyRect = preEnemy.getBoundingBox();
					if (cc.rectIntersectsRect(preEnemyRect,enemyRect)) {
						overlap = 1;
						break;
					}
				}
			}
			this.addChild(enemy, 20);
			var aEnemy = new Enemy(this.enemyId, name, this.timeCount, enemy);
			this.enemyList.push(aEnemy);
			this.enemyId++;
			if (name == "fire") {
				var coinAnima = new cc.Animation();  //利用动画保存每一帧的图片
				coinAnima.addSpriteFrameWithFile(res.Fire01_png);
				coinAnima.addSpriteFrameWithFile(res.Fire02_png);
				coinAnima.addSpriteFrameWithFile(res.Fire03_png);
				coinAnima.setDelayPerUnit(0.2);  //每一帧播放的间隔
				coinAnima.setRestoreOriginalFrame(true);  //是否回到第一帧播放
				var action = new cc.Animate(coinAnima);
				var repeat = new cc.RepeatForever(action);
				enemy.runAction(repeat);
			}
			if (this.enemyList.length == 5) {
				break;
			}
		}
	},
	
	updateEnemy:function(){
		var size = cc.winSize;
		if (this.enemyList.length <= 0) {
			return;
		}
		var index = new Array();
		for (var int = 0; int < this.enemyList.length; int++) {
			var element = this.enemyList[int];
			this.removeChild(this.enemyList[int].enemy, true);
			index.push(int);
			/*
			if (this.timeCount - element.timeCount >= 13) {
				this.removeChild(this.enemyList[int].enemy, true);
				index.push(int);
			}
			*/
		}
		this.enemyList.length = 0;
		/*
		for (var int2 = 0; int2 < index.length; int2++) {
			this.enemyList.splice(index[int2],1);
		}
		*/
	},

	
	addFood:function () {
		var size = cc.winSize;
		if (this.foodList.length >= 5) {
			return;
		}
		var nameList = new Array("苹果", "香蕉", "鸡腿", "西瓜", "汉堡", "饮料", "披萨");
		var index = Math.round((nameList.length - 1)*Math.random());

		var name = nameList[index];
		//产生一个食物
		var food;
		switch(index)
		{
			case 0: food = new cc.Sprite(res.Apple01_png);break;
			case 1: food = new cc.Sprite(res.Banana_png);break;
			case 2: food = new cc.Sprite(res.Chicken_png);break;
			case 3: food = new cc.Sprite(res.Watermelon_png);break;
			case 4: food = new cc.Sprite(res.Buger_png);break;
			case 5: food = new cc.Sprite(res.Fruit_png);break;
			case 6: food = new cc.Sprite(res.Pisa_png);break;			
		}
//		var element = new cc.Sprite(res.Boy_png);
//		element.setColor(cc.color(255,0,232));
		food.setAnchorPoint(cc.p(0.5, 0.5));// 设置锚点
		var overlap = 1;//设置重叠标志
		while (overlap == 1) {
			overlap = 0;
			food.setPosition(size.width*Math.random(), size.height*Math.random());// 设置位置
			var foodRect = food.getBoundingBox();
			
			var length;
			if (this.foodList == null) 
				length = 0;
			else
				length = this.foodList.length;
			for (var int = 0; int < length; int++) {
				var preFood  = this.foodList[int].food;
				var preFoodRect = preFood.getBoundingBox();
				if (cc.rectIntersectsRect(preFoodRect,foodRect)) {
					overlap = 1;
					break;
				}
			}
			if (this.enemyList == null) 
				length = 0;
			else
				length = this.enemyList.length;
			for (var int = 0; int < length; int++) {
				var preEnemy  = this.enemyList[int].enemy;
				var preEnemyRect = preEnemy.getBoundingBox();
				if (cc.rectIntersectsRect(preEnemyRect,foodRect)) {
					overlap = 1;
					break;
				}
			}
		}
		
		this.addChild(food, 20);
		var aFood = new Food(this.foodId, name, this.timeCount, food);
		this.foodList.push(aFood);
		this.foodId++;
		if (name == "苹果") {
			var coinAnima = new cc.Animation();  //利用动画保存每一帧的图片
			coinAnima.addSpriteFrameWithFile(res.Apple01_png);
			coinAnima.addSpriteFrameWithFile(res.Apple02_png);
			coinAnima.addSpriteFrameWithFile(res.Apple03_png);
			coinAnima.addSpriteFrameWithFile(res.Apple04_png);
			coinAnima.setDelayPerUnit(0.1);  //每一帧播放的间隔
			coinAnima.setRestoreOriginalFrame(true);  //是否回到第一帧播放
			var action = new cc.Animate(coinAnima);
			var repeat = new cc.RepeatForever(action);
			food.runAction(repeat);
		}

	},

	
	updateFood:function() {
		var size = cc.winSize;
		if (this.foodList.length <= 0) {
			return;
		}
		var index = new Array();
		for (var int = 0; int < this.foodList.length; int++) {
			var element = this.foodList[int];
			if (this.timeCount - element.timeCount >= 13) {
				this.removeChild(this.foodList[int].food, true);
				index.push(int);
			}
		}
		for (var int2 = 0; int2 < index.length; int2++) {
			this.foodList.splice(index[int2],1);
		}
	},
		
	updateGame:function(){
		var size = cc.winSize;
		if (this.foodList.length > 0) {
			var fattyRect = this.fatty.getBoundingBox();
			var index = new Array();
			for (var int = 0; int < this.foodList.length; int++) {
				var element = this.foodList[int].food;
				var elementRect = element.getBoundingBox();
				if (cc.rectIntersectsRect(fattyRect,elementRect)) {
					this.kilogram += 5;
					this.speed -= 20;
					if (this.speed < 10.0) {
						this.speed = 10.0;
					}
					cc.log("speed: "+this.speed);
					this.kgLabel.setString(this.kilogram+"kg"); 
					this.removeChild(element, true);
					index.push(int);
				}
			}
			for (var int2 = 0; int2 < index.length; int2++) {
				this.foodList.splice(index[int2],1);
			}
		}
		if (this.enemyList != null && this.enemyList.length > 0) {
			var fattyRect = this.fatty.getBoundingBox();
			var index = new Array();
			for (var int = 0; int < this.enemyList.length; int++) {
				var element = this.enemyList[int].enemy;
				var elementRect = element.getBoundingBox();
				if (cc.rectIntersectsRect(fattyRect,elementRect)) {
					//cc.log("game over!");
					var scene = new gameStartScene();
					cc.director.runScene(scene);
					//this.removeChild(element, true);
					//index.push(int);
				}
			}
			for (var int2 = 0; int2 < index.length; int2++) {
				this.enemyList.splice(index[int2],1);
			}
		}	
	},
	
	updateTimer:function() {
		if(this.timer == null) return;
		this.millisecond += 100;
		if (this.millisecond % 1000 == 0) {
			this.millisecond = 0;
			this.second+=1;
			this.timeCount += 1;
			if (this.second % 60 == 0) {
				this.second = 0;
				this.minute++;
			}
		}
		var mText, sText, msText;
		if (this.minute < 10) {
			mText = "0" + this.minute.toFixed(0);
		} else {
			mText = this.minute.toFixed(0);
		}
		if (this.second < 10) {
			sText = "0" + this.second.toFixed(0);
		} else {
			sText = this.second.toFixed(0);
		}
		if (this.millisecond == 0) {
			msText = "000";
		} else {
			msText = this.millisecond.toFixed(0);
		}
		this.timer.setString(mText + ":" + sText + ":" + msText);
	},
	
});
	


var playScene = cc.Scene.extend({
	playLayer:null,
	// 构造函数
	ctor: function () {
		this._super();
	},
	onEnter:function () {
		this._super();
		this.playLayer = new playLayer();
		this.addChild(this.playLayer);
	}
});
