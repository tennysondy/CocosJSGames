
var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    
    ctor:function () {
//        //////////////////////////////
//        // 1. super init first
        this._super();

        this._size = cc.Director.getInstance().getWinSize(); // 获得游戏屏幕尺寸 
        this.gameLayer = cc.Layer.create(); // 创建名为“gameLayer”的新图层 
        this.addChild(this.gameLayer); //加在这个新图层 
        var bg = cc.Sprite.create(res.HelloWorld_png); // 创建精灵加载图片“s_HelloWorld” 
        this.gameLayer.addChild(bg, 1); //在gameLayer层上加载这个精灵 
        bg.setAnchorPoint(cc.p(0.5, 0.5));// 设置锚点 
        bg.setPosition(this._size.width/2, this._size.height/2);// 设置位置
//
//        /////////////////////////////
//        // 2. add a menu item with "X" image, which is clicked to quit the program
//        //    you may modify it.
//        // ask the window size
//        var size = cc.winSize;
//
//        // add a "close" icon to exit the progress. it's an autorelease object
//        var closeItem = new cc.MenuItemImage(
//            res.CloseNormal_png,
//            res.CloseSelected_png,
//            function () {
//                cc.log("Menu is clicked!");
//                window.close();
//            }, this);
//        closeItem.attr({
//            x: size.width - 20,
//            y: 20,
//            anchorX: 0.5,
//            anchorY: 0.5
//        });
//
//        var menu = new cc.Menu(closeItem);
//        menu.x = 0;
//        menu.y = 0;
//        this.addChild(menu, 1);
//
//        /////////////////////////////
//        // 3. add your codes below...
//        // add a label shows "Hello World"
//        // create and initialize a label
//        var helloLabel = new cc.LabelTTF("Hello World", "Arial", 38);
//        // position the label on the center of the screen
//        helloLabel.x = size.width / 2;
//        helloLabel.y = 0;
//        // add the label as a child to this layer
//        this.addChild(helloLabel, 5);
//
//        // add "HelloWorld" splash screen"
//        this.sprite = new cc.Sprite(res.HelloWorld_png);
//        this.sprite.attr({
//            x: size.width / 2,
//            y: size.height / 2,
//            scale: 0.5,
//            rotation: 180
//        });
//        this.addChild(this.sprite, 0);
//
//        this.sprite.runAction(
//            cc.sequence(
//                cc.rotateTo(2, 0),
//                cc.scaleTo(2, 1, 1)
//            )
//        );
//        helloLabel.runAction(
//            cc.spawn(
//                cc.moveBy(2.5, cc.p(0, size.height - 40)),
//                cc.tintTo(2.5,255,125,0)
//            )
//        );
//        return true;
    }

});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

