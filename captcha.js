const _ = require('lodash');
const crypto = require('crypto');
const dict = [
	...'abcdefghijklmnopqrstuvwxyz01234567890',
	// ...'`-=~_+[]\{}|;\':",./<>?',
];

const generate = function (password, type) {
	switch (type) {
		case 'a': {
			// 密码去重
			const bytes = _.uniq([...password]);
			// 洗牌，按文档说明是 Fisher-Yates shuffle 算法，下同
			const poolx = _.shuffle(bytes);
			// 复制一份字典并排出密码所用字符后洗牌
			const pooly = _.shuffle(_.pullAll([...dict], bytes));
			// 取出 [0, 4) 子集，洗牌后取出前三个即实现从一个数组中随机取三个条目，下同
			const x = poolx.slice(0, 4);
			// 取出 [0, 8 - x长度) 子集
			const y = pooly.slice(0, 8 - x.length);
			// 组合 x，y 并洗牌
			const slices = _.shuffle([...x, ...y]);
			return {
				description: 'Choose all characers/symbols appeared in your password.',
				password,
				correctSlices: x,
				slices,
				type,
			};
		}
		case 'b': {
			// 使用 nodejs 内置 crypto 库算 md5
			const hash = crypto.createHash('md5').update(password).digest("hex");
			// hash 为 32 字节，所以取偶数位得到 16 字节
			const string = _.filter([...hash], (item, idx) => idx % 2 === 0).join('');
			// 打乱所需的 slice size
			const sizes = _.shuffle([2, 2, 3, 3, 3, 3]);
			let cursor = 0;
			// 按各 slice size 取子字符串并打乱
			const slices = _.shuffle(_.map(sizes, size => {
				const slice = string.substr(cursor, size);
				cursor += size;
				return slice;
			}));
			return {
				password,
				description: 'Click to make all parts together in corret order.',
				string,
				slices,
				type,
			};
		}
		case 'c': {
			return {
				password,
				description: 'Input these characters.',
				string: _.shuffle(dict).slice(0, 6).join(''),
				slices: [_.shuffle(dict).slice(0, 6).join('')],
				type,
			}
		}
		default: {
			return {
				password,
				string: password,
				slices: [password],
				type,
			};
		}
	}
};

const verify = function (captcha) {
	switch (captcha.type) {
		case 'a': {
			const x = captcha.correctSlices;
			const y = _.map(captcha.result, item => captcha.slices[item]);
			// 对比两个数组，_.difference(x, y) 只看 x 是不是 y 的子集
			return _.difference(y, x).length === 0;
		}
		case 'b': {
			return captcha.string === _.map(
				captcha.result, item => captcha.slices[item]).join('');
		}
		case 'c': {
			return captcha.string === captcha.result;
		}
		default: {
			return false;
		}
	}
};

module.exports = {
	generate,
	verify,
};
