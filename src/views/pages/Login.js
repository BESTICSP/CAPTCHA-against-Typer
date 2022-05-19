import { h, Component } from 'preact';
import { Link, route } from 'preact-router';
import linkState from 'linkstate';

export default class Login extends Component {
	state = {
		loginName: '',
		password: '',
	}
	login = async () => {
		if (this.state.loginName.length < 4 || this.state.password < 4) {
			alert('登录名和密码最少为 4 位!')
		} else {
			const resp = await fetch('/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'same-origin',
				body: JSON.stringify({
					loginName: this.state.loginName,
					password: this.state.password,
				}),
			});
			const respData = await resp.json();
			route(`/captcha/${this.props.type}`);
		}
	}
	render (props) {
		return (
			<div className='modal-content'>
				<div className='modal-header'>
					<h4 class="modal-title">Login</h4>
				</div>
				<div className='modal-body'>
					<div class='form-group'>
						<label>Login Name</label>
						<input type='text'
							class='form-control' placeholder='Your login name'
							onInput={linkState(this, 'loginName')} value={this.state.loginName}  />
					</div>
					<div class='form-group'>
						<label>Password</label>
						<input type='password' class='form-control' placeholder='Your password'
							onInput={linkState(this, 'password')} value={this.state.password}  />
					</div>
				</div>
				<div class='modal-footer'>
					<Link href='/' className='btn btn-link pull-left'>Home</Link>
					<button onClick={this.login} class='btn btn-primary'>Next</button>
				</div>
			</div>
		);
	}
}
