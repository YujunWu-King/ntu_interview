<template>
	<div class="hello">
		<div style="text-align: center;line-height: 30;z-index: 999;">
			<p style="position: relative;top: 20px;line-height: 0px;">请在以下方框内进行电子签名</p>
			<canvas id="canvas" width="600" height="400" style="border:1px solid black;border-radius: 10px;margin-top: 10px;">Canvas画板</canvas></div>
		<div style="text-align: center;line-height: 50px;z-index: 999;">
			<!--<button class="threeBTN" v-on:click="clear">清除</button>-->
			<button class="threeBTN" v-on:click="close">返回</button>
			<button class="threeBTN" v-on:click="save">保存</button>
		</div>
	</div>

</template>

<script>
	let draw;
	//let flagD = false;
	let preHandler = function(e) {
		e.preventDefault();
	}
	class Draw {
		constructor(el) {
			this.el = el;
			this.canvas = document.getElementById(this.el);
			this.cxt = this.canvas.getContext('2d');
			this.stage_info = canvas.getBoundingClientRect();
			this.path = {
				beginX: 0,
				beginY: 0,
				endX: 0,
				endY: 0
			}
		}
		init(btn) {
			let that = this;

			this.canvas.addEventListener('touchstart', function(event) {
				document.addEventListener('touchstart', preHandler, {
					passive: false
				});
				that.drawBegin(event)
			}, {
				passive: false
			})
			this.canvas.addEventListener('touchend', function(event) {
				document.addEventListener('touchend', preHandler, {
					passive: false
				});
				that.drawEnd()

			}, {
				passive: false
			})
			this.clear(btn)
		}
		drawBegin(e) {
			//flagD = true;
			this.cxt = this.canvas.getContext('2d');
			this.stage_info = canvas.getBoundingClientRect();

			let that = this;
			window.getSelection() ? window.getSelection().removeAllRanges() : document.selection.empty()
			this.cxt.strokeStyle = "#000"
			this.cxt.beginPath()
			this.cxt.moveTo(
				e.changedTouches[0].clientX - this.stage_info.left,
				e.changedTouches[0].clientY - this.stage_info.top
			)
			this.path.beginX = e.changedTouches[0].clientX - this.stage_info.left
			this.path.beginY = e.changedTouches[0].clientY - this.stage_info.top
			canvas.addEventListener("touchmove", function() {
				that.drawing(event)
			}, {
				passive: false
			})
		}
		drawing(e) {
			this.cxt.lineTo(
				e.changedTouches[0].clientX - this.stage_info.left,
				e.changedTouches[0].clientY - this.stage_info.top
			)
			this.path.endX = e.changedTouches[0].clientX - this.stage_info.left
			this.path.endY = e.changedTouches[0].clientY - this.stage_info.top
			this.cxt.stroke()
		}
		drawEnd() {
			document.removeEventListener('touchstart', preHandler, {
				passive: false
			});
			document.removeEventListener('touchend', preHandler, {
				passive: false
			});
			document.removeEventListener('touchmove', preHandler, {
				passive: false
			});
		}
		clear(btn) {
			this.cxt.clearRect(0, 0, 600, 400);
		}
		save() {
			return canvas.toDataURL("image/png");
		}
	}

	export default {
		data() {
			return {
				val: true,
				url: "",
				draw: "",
				initData: ""
			}
		},
		mounted() {
			this.draw = new Draw('canvas');
			this.draw.init();
		},
		methods: {
			clear() {
				this.draw.clear();
			},
			save() {
				let data = this.draw.save();
				let c = document.getElementById("canvas");
				let me = this;
				if(!this.isCanvasBlank(c)) {
					me.$vux.confirm.show({
						title: "是否确认提交，提交后将无法修改！",
						onConfirm() {
							me.$emit("save", data);
						}
					});
				} else {
					this.$vux.toast.show({
						type: 'text',
						position: 'top',
						width: '250px',
						time: 2000,
						text: '请您签名！'
					});
				}
			},
			close() {
				this.draw.clear();
				this.$emit("close", false);
			},
			isCanvasBlank(canvas) {
				let blank = document.createElement('canvas'); //系统获取一个空canvas对象
				blank.width = canvas.width;
				blank.height = canvas.height;
				return canvas.toDataURL() == blank.toDataURL(); //比较值相等则为空
			}
		}
	}
</script>
<style scoped>
	.threeBTN {
		border-radius: 5px;
		width: 120px;
		height: 40px;
		text-align: center;
		line-height: 38px;
		color: #fff;
		background: #9e1e2b;
	}
	
	h1,
	h2 {
		font-weight: normal;
	}
	
	ul {
		list-style-type: none;
		padding: 0;
	}
	
	li {
		display: inline-block;
		margin: 0 10px;
	}
	
	a {
		color: #42b983;
	}
	
	.hello {
		position: absolute;
		width: 100%;
		height: 95%;
		background-color: #eeee;
	}
	
	#canvas {
		background: #DDDDDD;
		cursor: default;
	}
	
	#keyword-box {
		margin: 10px 0;
	}
</style>