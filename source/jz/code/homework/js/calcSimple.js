// 算法思路来自https://blog.csdn.net/lwangji/article/details/107219072 & https://blog.csdn.net/weixin_44668898/article/details/96207910
// 0.退格键没实现  --done--
// 1.初始输入长度限制功能暂未实现 --done--
// 2.暂时未完成的时当输入一次小数点后无法再输入小数点的功能 --done--
// 3.从默认开始的正负数的功能未实现  --done--
// 4.连续计算有BUG

var Num1 = 0; //第一个数
var Num2 = 0; //第二个数
var oper; //存储运算符
var resultNum = 0; //显示结果
var tag = false; //是否得到了第一个数
var slip = false; //判断是否出现ERROR
var neg = false; //判断是否切换了负数
var text = document.getElementById('text');
var decimals = document.getElementById('dot');
var times = document.getElementById('time');
var btnNeg = document.getElementById('neg');

var sw = false; //开关
var res = document.getElementById('res');
var opens = document.getElementById('open');
var close = document.getElementById('close');
var ok = document.getElementById('ok');
var err = document.getElementById('err');

clock();
setInterval("clock()", 1000);

function clock() { //时间
	var now = new Date();
	var hh = now.getHours();
	var mm = now.getMinutes();
	var ss = now.getSeconds();
	var clock = '';

	if (hh < 10) {
		clock += '0';
	}
	clock += hh + ':';
	if (mm < 10) {
		clock += '0';
	}
	clock += mm + ':';
	if (ss < 10) {
		clock += '0';
	}
	clock += ss;

	time.innerHTML = clock;
}

// 表显 + 计算 + 主函数
function input_text(num) {
	if (num == '.') {
		if (sw) {
			decimals.disabled = true;
		} else {
			decimals.disabled = false;
		}

	}
	if (sw) {
		if (num == '1' || num == '2' || num == '3' || num == '4' || num == '5' || num == '6' || num == '7' ||
			num ==
			'8' || num == '9' || num == '0' || num == '.') { //内容判断
			if (slip) {
				text.value = text.value;
			} else {
				if (text.value.length + 1 > 16) {
					alert('最高支持输入16位数！！！');
				} else {
					if (neg) {
						if (text.value == 0) {
							btnNeg.disabled = true;
							if (num == '.' || text.value == '0.') {
								text.value = '-' + text.value + num;
							} else {
								text.value = '-' + num;
							}
						} else {
							text.value = text.value + num;
						}
					} else {
						if (text.value == 0) {
							if (num == '.' || text.value == '0.') {
								text.value = text.value + num;
							} else {
								text.value = num;
							}
						} else {
							text.value = text.value + num;
						}
					}
				}
			}
		} else if (num == '+' || num == '-' || num == 'x' || num == '÷' || num == '%' || num == '=') { //符号判断
			if (tag == false) {
				oper = num
				tag = true;
				if (text.value.indexOf('.') != (-1)) {
					Num1 = parseFloat(text.value);
				} else {
					Num1 = parseInt(text.value);
				}
				text.value = '0';
				decimals.disabled = false;
				window.neg = false;
				btnNeg.disabled = false;
			} else {
				if (text.value.indexOf('.') != (-1)) {
					Num2 = parseFloat(text.value);
				} else {
					Num2 = parseInt(text.value);
				}
				switch (oper) {
					case '+':
						resultNum = Num1 + Num2;
						break;
					case '-':
						resultNum = Num1 - Num2;
						break;
					case 'x':
						resultNum = Num1 * Num2;
						break;
					case '÷':
						resultNum = Num1 / Num2;
						break;
					case '%':
						resultNum = Num1 % Num2;
						break;
					default:
						text.value = text.value;
						break;
				}
				text.value = resultNum;
				if (isNaN(resultNum) || isFinite(resultNum) == false) {
					window.slip = true;
					text.value = '!!!  ERROR  !!!';
					text.style.color = 'red';
					text.style.fontWeight = 'bold';
					text.style.textAlign = 'center';
					err.style.backgroundColor = 'red';
					err.style.boxShadow = '0 0 2px red,0 0 5px red,0 0 10px red';
				} else {
					tag = false;
					Num1 = resultNum;
				}
			}
		} else if (num == '+/-') {
			btnNeg.disabled = true;
			text.value = '-' + text.value;
			window.neg = true;
		}
	} else {
		text.value = '';
	}
}
// Backspace
function back() {
	if (slip) {
		text.value = '!!!  ERROR  !!!';
		text.style.color = 'red';
		text.style.fontWeight = 'bold';
		text.style.textAlign = 'center';
		err.style.backgroundColor = 'red';
		err.style.boxShadow = '0 0 2px red,0 0 5px red,0 0 10px red';
	} else {
		if (text.value.length == 1) {
			text.value = '0';
		} else {
			text.value = text.value.substring(0, text.value.length - 1);
		}
	}
}

// AC & switch
function com(flag) {
	Num1 = 0;
	Num2 = 0;
	resultNum = 0;
	tag = false;
	window.slip = false;
	window.neg = false;
	btnNeg.disabled = false;
	dot.disabled = false;
	text.style.color = '#000';
	text.style.fontWeight = '400';
	text.style.textAlign = 'right';
	err.style.backgroundColor = '';
	err.style.boxShadow = '';
	if (flag == 1) {
		ok.style.backgroundColor = 'green';
		ok.style.boxShadow = '0 0 2px green,0 0 5px green,0 0 10px green';
		window.sw = true;
		text.value = '0';
	} else if (flag == 0) {
		ok.style.backgroundColor = '';
		ok.style.boxShadow = '';
		window.sw = false;
		text.value = '';
	}
	if (flag == -1) {
		if (sw) {
			text.value = '0';
		} else {
			text.value = '';
		}
	}
}