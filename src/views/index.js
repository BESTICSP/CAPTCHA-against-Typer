import { h } from 'preact'
import { Router } from 'preact-router';
import { createHashHistory } from 'history';
import Home from './pages/Home';
import Login from './pages/Login';
import Result from './pages/Result';
import Captcha from './pages/Captcha';
import Error404 from './pages/errors/404';

// track pages on route change
const onChange = obj => window.ga && ga('send', 'pageview', obj.url);
const history = createHashHistory();

export default (
	<div class='modal in'>
		<div class='modal-dialog'>
			<Router onChange={ onChange } history={ history }>
				<Home path='/' />
				<Login path='/login/:type' />
				<Captcha path='/captcha/:type' />
				<Result path='/result/:id' />
				<Error404 default />
			</Router>
		</div>
	</div>
);
