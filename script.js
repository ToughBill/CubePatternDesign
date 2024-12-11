let __enable_debug_4567__ = false;
let patternType = 'd12';
const FontDotSettings = {
	'd12': {
		font_row: 15,
		font_col: 13,
		dot_row_start_index: 1,
		dot_row_end_index: 12,
		dot_col_start_index: 0,
		dot_col_end_index: 11,
		spanClass: 'dot12',
	},
	'd9': {
		font_row: 11,
		font_col: 10,
		dot_row_start_index: 1,
		dot_row_end_index: 9,
		dot_col_start_index: 0,
		dot_col_end_index: 8,
		spanClass: 'dot9',
	}
};
if (!__enable_debug_4567__) {
	const outputDiv = document.getElementById('output');
	outputDiv.style.position = "absolute";
	outputDiv.style.left = "-9999px";

	const canvasContainer = document.getElementById('canvasContainer');
	canvasContainer.style.position = "absolute";
	canvasContainer.style.left = "-7999px";
}
function displayText() {
	const input = document.getElementById('textInput').value;

	const outputDiv = document.getElementById('output');
	outputDiv.innerHTML = '';
	
	const tableContainer = document.getElementById('tableContainer');
	tableContainer.innerHTML = '';
	
	const canvasContainer = document.getElementById('canvasContainer');
	canvasContainer.innerHTML = '';

	const splitBlocks = document.getElementById('__splitted_blocks__');
	if (splitBlocks) {
		splitBlocks.innerHTML = '';
	}
	
	for (const char of input) {
		const span = document.createElement('span');
		span.textContent = char;
		span.className = 'schar ' + FontDotSettings[patternType].spanClass;
		outputDiv.appendChild(span);

		html2canvas(span).then(canvas => {
			canvasContainer.appendChild(canvas);
			processCanvas(canvas, char);
		});
	}
}

function getFontDotDims(type) {
	let dims = {row: 15, col: 13};
	if (type == '9') {
		dims = {row: 11, col: 10};
	} else if (type == '0') {
		dims = {row: -1, col: -1};
	}
	return dims;
}

// 等待 OpenCV.js 加载完成
function onOpenCvReady() {
	console.log('OpenCV.js is ready!');
}

function processCanvas(canvas, char) {
	const src = cv.imread(canvas);
	const width = src.cols;
	const height = src.rows;

	const blockWidth = Math.floor(width / FontDotSettings[patternType].font_col); 
	const blockHeight = Math.floor(height / FontDotSettings[patternType].font_row);

	let dotMatrix = [];
	let splitBlocks, charBlockCon;
	let blockRowCon;
	if (__enable_debug_4567__) {
		splitBlocks = document.getElementById('__splitted_blocks__');
		if (!splitBlocks) {
			splitBlocks = document.createElement("div");
			splitBlocks.id = "__splitted_blocks__";
			document.body.appendChild(splitBlocks);
		}
		charBlockCon = document.createElement("div");
		charBlockCon.className = "charCon";
		charBlockCon.height = height + 20;
		charBlockCon.width = width + 20;
		charBlockCon.id = "char" + char;
		splitBlocks.appendChild(charBlockCon);
	}
	for (let row = 0; row < FontDotSettings[patternType].font_row; row++) {
		let rowData = [];
		if (__enable_debug_4567__) {
			blockRowCon = document.createElement("div");
			blockRowCon.className = "blockRow";
			blockRowCon.height = blockHeight;
			charBlockCon.appendChild(blockRowCon);
		}
		for (let col = 0; col < FontDotSettings[patternType].font_col; col++) {
			let x = col * blockWidth;
			let y = row * blockHeight;
			let roi = new cv.Rect(x, y, blockWidth, blockHeight);

			// 提取切块区域
			let block = src.roi(roi);

			if (__enable_debug_4567__) {
				let blockImg = document.createElement("canvas");
				let blockId = char + "_r" + row + "c" + col;
				blockImg.id = blockId;
				blockImg.className = "blockImg";
				blockRowCon.appendChild(blockImg);
				cv.imshow(blockId, block);
			}

			// 将图像块转化为灰度图像
			let gray = new cv.Mat();
			cv.cvtColor(block, gray, cv.COLOR_RGBA2GRAY);

			// 判断该块是否为纯白
			let isWhite = isBlockWhite(gray);

			// 将 0 或 1 添加到行数据中
			rowData.push(isWhite ? 0 : 1);

			// 释放内存
			block.delete();
			gray.delete();
		}
		dotMatrix.push(rowData);
	}
	// 释放内存
	src.delete();

	let validDotMatrix = dotMatrix.slice(FontDotSettings[patternType].dot_row_start_index, FontDotSettings[patternType].dot_row_end_index + 1)
									.map(row => row.slice(FontDotSettings[patternType].dot_col_start_index, FontDotSettings[patternType].dot_col_end_index + 1));
	displayBitmapTable(validDotMatrix);
}

// 判断块是否为纯白，基于中心点像素
function isBlockWhite(grayBlock) {
    // 获取块的中心坐标
    const centerX = Math.floor(grayBlock.cols / 2);
    const centerY = Math.floor(grayBlock.rows / 2);

    // 获取中心点的灰度值
    const centerPixelValue = grayBlock.ucharPtr(centerY, centerX)[0];

    // 判断中心点是否接近白色（灰度值 255）
    return centerPixelValue > 200; // 设定阈值 200，接近白色
}

function showMat(num, id) {
    let numCon = document.getElementById("numCon");
    let ele = document.createElement("canvas");
    if (id) {
        ele.id = id;
    }
    numCon.appendChild(ele);
    cv.imshow(id, num);
}

function displayBitmapTable(bitmap) {
	const tableContainer = document.getElementById('tableContainer');
	//tableContainer.innerHTML = ''; // 清空之前的表格

	const table = document.createElement('table');
	table.className = "code-points";
	const rows = bitmap.length;
	const cols = bitmap[0].length;

	// 添加列号行
	const headerRow = document.createElement('tr');
	headerRow.appendChild(document.createElement('th')); // 左上角空单元格
	for (let col = 1; col <= cols; col++) {
		const th = document.createElement('th');
		th.textContent = col;
		headerRow.appendChild(th);
	}
	table.appendChild(headerRow);

	// 添加数据行
	for (let row = 0; row < rows; row++) {
		const tr = document.createElement('tr');
		const rowHeader = document.createElement('th');
		// rowHeader.textContent = String.fromCharCode(65 + row); // 行号 A, B, C...
		rowHeader.textContent = row + 1;
		tr.appendChild(rowHeader);

		for (let col = 0; col < cols; col++) {
			const td = document.createElement('td');
			if (bitmap[row][col] === 1) {
				td.classList.add('cell-1'); // 设置红色背景
			}
			tr.appendChild(td);
		}
		table.appendChild(tr);
	}

	// 添加表格到容器
	tableContainer.appendChild(table);
}

function reset() {
	document.getElementById('textInput').value = '';

	const outputDiv = document.getElementById('output');
	outputDiv.innerHTML = '';

	const tableContainer = document.getElementById('tableContainer');
	tableContainer.innerHTML = '';
	
	const canvasContainer = document.getElementById('canvasContainer');
	canvasContainer.innerHTML = '';

	const splitBlocks = document.getElementById('__splitted_blocks__');
	if (splitBlocks) {
		splitBlocks.innerHTML = '';
	}
}

function selectOption(type) {
	patternType = type;
}