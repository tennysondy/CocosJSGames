var isTouch = 0;

cc.game.onStart = function(){
    cc.view.adjustViewPort(true);
    if (isTouch == 1) {
    	cc.view.setDesignResolutionSize(960, 640, cc.ResolutionPolicy.SHOW_ALL);
	} else {
		cc.view.setDesignResolutionSize(1920, 1080, cc.ResolutionPolicy.SHOW_ALL);
	}
    
    cc.view.resizeWithBrowserSize(true);
    //load resources
    cc.LoaderScene.preload(g_resources, function () {
    	cc.director.runScene(new gameStartScene());
    }, this);
};
cc.game.run();