/**
 * 原生js扫雷游戏
 * chrome版本: 57.0.2987.133 (64-bit)
 */
(function() {

	var App = {
		app: null,
		boxs: null,
		rows: null,
		columns: null,
		/**
		 * 初始化函数，只执行一次
		 * @method init
		 */
		init: function() {
			this.app = document.getElementById('app');
			this.reset();

			//鼠标右击
			this.app.oncontextmenu = (event) => {
				
				var currentBox = this.boxs[Number(event.target.getAttribute('index'))];

				if (currentBox.state === 0) {
					event.target.style.backgroundImage = 'url("./flag.png")';
					currentBox.state = 1;
					this.checkout();
				}
				else if (currentBox.state === 1) {
					event.target.style.backgroundImage = '';
					currentBox.state = 0;
				}
				
				return false; //阻止浏览器默认的右键弹出菜单
			}

			//鼠标左击
			this.app.onclick = (event) => {
				var index = Number(event.target.getAttribute('index'));

				if (this.boxs[index].isLandMind) {
					alert('Game over!')
				} else {
					this.clear(index);
					this.checkout();
				}
			}
		},
		/**
		 * 初始化每个格子的属性
		 * @method initBoxs
		 */
		initBoxs: function() {

			//初始化格子，按概率设置地雷
			this.boxs.forEach((box, i) => {

				if (Math.random() <= 0.1) {
					box.isLandMind = 1;
					// this.app.children[i].style.backgroundColor = 'red';
				}

			});

			for (var i = 0; i < this.boxs.length; i++) {

				//把格子当成一个二位数组，计算出格子的下标值
				var row = Math.floor(i / this.columns);
				var column = i % this.columns;

				for (var j = column - 1; j <= column + 1; j++) {

					if (j < 0 || j > this.columns - 1) continue; //排除边界值
					for (var k = row - 1; k <= row + 1; k++) {

						if (k < 0 || k > this.rows - 1) continue; //排除边界值
						if (j === column && k === row) continue; //排除自己
						var index = k * this.columns + j;
						// console.log(index);
						this.boxs[i].count += this.boxs[index].isLandMind ? 1 : 0;
					}
				}

			}
		},
		/**
		 * 可更改格子的列数与行书，然后重置所有数据
		 * @method reset
		 * @author 陈景
		 * @param  {Number} [rows=15]    格子的列数
		 * @param  {Number} [columns=20] 格子的行数
		 */
		reset: function(rows = 10, columns = 10) {
			this.app.style.height = rows * 20 + 'px';
			this.app.style.width  = columns * 20 + 'px';
			this.rows = rows;
			this.columns = columns;

			var html = '';
			var count = rows * columns;
			var index = 0;
			this.boxs = [];

			while (count--) {
				html += `<div index='${index++}'></div>`;
				this.boxs.push({
					count: 0, //附近的地雷数量
					state: 0, //0: 初始化状态 1: 标记为地雷 2: 被翻牌并且不是地雷
					isLandMind: 0 //0: 不是地雷 1:是地雷
				});
			}

			this.app.innerHTML = html;
			this.initBoxs();
		},
		/**
		 * 清除掉非地雷的格子
		 * @method clear
		 * @author 陈景
		 * @param  {number} index 当前被点击的格子下标
		 */
		clear: function(index) {
			var _this = this;
			(function exec(i) {

				var box = _this.boxs[i];
				if (box.state === 0) {
					_this.app.children[i].style.backgroundColor = '#e4e3e3';
					box.state = 2;
					if (box.count > 0) {
						_this.app.children[i].innerHTML = box.count;
					}
				}
				if (box.count === 0) {

					var row = Math.floor(i / _this.columns);
					var column = i % _this.columns;

					for (var j = column - 1; j <= column + 1; j++) {

						if (j < 0 || j >= _this.columns) continue;
						for (var k = row - 1; k <= row + 1; k++) {

							if (k < 0 || k >= _this.rows) continue;
							if (k === row && j === column) continue;
							var idx = _this.columns * k + j;

							if (_this.boxs[idx].state === 0) {
								exec(idx);
							}

						}
					}

				}
			}(index));
		},
		/**
		 * 检验当前是否已经成功扫完所有地雷，如果成功则给出提示并结束游戏
		 * @method checkout
		 * @author 陈景
		 */
		checkout: function() {
			for (var i = 0; i < this.boxs.length; i++) {
				var box = this.boxs[i];
				if (!((box.state === 1 && box.isLandMind) 
					|| (box.state === 2 && !box.isLandMind))
					|| box.state === 0) {
					return;
				}
			}
			alert('你赢啦');
			return true;
		}
	}
	App.init();

	// window.App = App;

}());