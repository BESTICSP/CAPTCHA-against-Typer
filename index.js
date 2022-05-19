const Koa = require('koa');
const { MongoClient, ObjectID } = require('mongodb');
const Router = require('koa-router');
const static = require('koa-static');
const svgCaptcha = require('svg-captcha');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
const _ = require('lodash');
const proxy = require('koa-proxies');
const xlsx = require('xlsx');
const { format } = require('date-fns');
const { promisify } = require('util');
const glob = promisify(require('glob'));
const captcha = require('./captcha');

const app = new Koa();
const router = new Router();

function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}

router.post('/login', async ctx => {
	ctx.session.login = ctx.request.body;
	ctx.session.id = new ObjectID();
	ctx.session.round = 0;
	ctx.body = {
		id: ctx.session.id,
		round: ctx.session.round,
	};
});

router.get('/captcha/image', async ctx => {
	const string = ctx.query.string || _.get(ctx.session, 'captcha.string', '');
	const size = string.length;
	const randomIndex = Math.round((ctx.fonts.length - 1) * Math.random());
	svgCaptcha.loadFont(ctx.fonts[randomIndex]);
	const captcha = svgCaptcha(string, {
		width: 40 * size,
		height: 70,
		noise: 3,
		color: true,
	});
	ctx.set('Content-Type', 'image/svg+xml');
	ctx.body = captcha;
});

router.get('/captcha/:type', async ctx => {
	const { loginName, password } = ctx.session.login;
	ctx.session.captcha = captcha.generate(password, ctx.params.type);
	const { string, slices, description } = ctx.session.captcha;
	ctx.body = {
		noImage: !string,
		size: slices.length,
		description: description,
		loginName: loginName,
		type: ctx.params.type,
	};
});

router.get('/captcha/slices/:no', async ctx => {
	const slice = _.get(ctx.session, ['captcha', 'slices', ctx.params.no]);
	if (slice) {
		const randomIndex = Math.round((ctx.fonts.length - 1) * Math.random());
		svgCaptcha.loadFont(ctx.fonts[randomIndex]);
		const captcha = svgCaptcha(slice, {
			width: 40 * slice.length,
			height: 70,
			noise: 3,
		});
		ctx.set('Content-Type', 'image/svg+xml');
		ctx.body = captcha;
	} else {
		ctx.status = 404;
		ctx.body = '';
	}
});

router.post('/verify', async ctx => {
	const c = _.assign({}, ctx.session.captcha, ctx.request.body);
	const result = captcha.verify(c);
	const record = {
		time: ctx.request.body.time,
		userId: ctx.session.id,
		round: ctx.session.round++,
		login: ctx.session.login,
		captcha: c,
		result,
		createdAt: new Date(),
	};
	const res = await ctx.db.collection('records').insert(record);
	ctx.body = res.ops[0];
});

router.get('/results/:id', async ctx => {
	ctx.body = await ctx.db.collection('records').findOne({
		_id: new ObjectID(ctx.params.id),
	});
});

router.get('/results', async ctx => {
	const records = await ctx.db.collection('records').find().sort({ createdAt: 1 }).toArray();
	const data = _.map(records, record => ({
		id: record._id,
		time: record.time,
		userId: record.userId,
		round: record.round,
		loginName: record.login.loginName,
		password: record.login.password,
		result: record.result,
		captchaType: record.captcha.type,
		captchaString: record.captcha.string,
		captchaResult: record.captcha.result.join(','),
		captchaCorrectSlices: _.get(record, 'captcha.correctSlices', []).join(','),
		captchaSlices: _.get(record, 'captcha.slices', []).join(','),
		createdAt: record.createdAt,
	}));

	let aoa = [];
	if (data.length > 0) {
		const keys = _.keys(data[0]);
		aoa = [
			_.map(keys, _.startCase),
			...data.map(item => keys.map(key => item[key])),
		];
	}

	const wb = xlsx.utils.book_new();
	const sheet = xlsx.utils.aoa_to_sheet(aoa);
	xlsx.utils.book_append_sheet(wb, sheet);
	const file = xlsx.write(wb, {
		bookType: 'xlsx',
		bookSST: false,
		type: 'buffer'
	});
	const fileName = `results.${format(new Date(), 'YYYYMMDDHHmmss')}.xlsx`;
	ctx.set('Content-Disposition', `attachment; filename="${fileName}"`);
	ctx.set('Content-Type', 'application/octet-stream');
	ctx.body = file;
});

async function start () {
	const port = +process.env.PORT || 80;
	const mongoUrl = process.env.MONGO || 'mongodb://localhost:27017/hicaptcha';
	const fonts = await glob('./fonts/*');
	const db = await MongoClient.connect(mongoUrl);
	app.keys = ['i am a secret string'];
	app.use(static('./dist'));
	app.use(session({}, app));
	app.use(bodyParser());
	app.use(async (ctx, next) => {
		ctx.fonts = fonts;
		ctx.db = db;
		await next();
	});
	app.use(router.routes());
	app.use(router.allowedMethods());
	app.use(proxy('/', {
		target: `http://localhost:${port + 1}`,
		changeOrigin: true,
		logs: true
	}));
	const server = app.listen(port, '0.0.0.0', () => {
		console.log(server.address);
	});
}

start();
