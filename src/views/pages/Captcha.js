import { h, Component } from 'preact';
import { Link, route } from 'preact-router';
import CaptchaInputText from '../components/CaptchaInputText';
import CaptchaInputClick from '../components/CaptchaInputClick';
import Watermark from '../components/Watermark';

export default class Captcha extends Component {
	state = { captcha: { size: 0 }, result: [] }
	componentDidMount () {
		this.getCaptcha();
	}
	getCaptcha = async () => {
		const resp = await fetch(`/captcha/${this.props.type}`, {
			credentials: 'same-origin',
		});
		const respData = await resp.json();
		this.setState({ captcha: respData, start: new Date().getTime() });
	}
	onInputChange = (result) => {
		this.setState({ result });
	}
	verify = async () => {
		const resp = await fetch(`/verify`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'same-origin',
			body: JSON.stringify({
				result: this.state.result,
				time: new Date().getTime() - this.state.start,
			}),
		});
		const respData = await resp.json();
		const url = `/result/${respData._id}`;
		route(url);
	}
	render (props, { captcha, result, start }) {
		let CaptchaInput;
		if (props.type === 'a' || props.type === 'b') {
			CaptchaInput = CaptchaInputClick;
		} else {
			CaptchaInput = CaptchaInputText;
		}
		return (
			<div className='modal-content'>
				<div className='modal-header'>
					<h4 class="modal-title">Captcha</h4>
				</div>
				<div className='modal-body'>
					{
						!captcha.noImage && <div className={`captcha captcha-${props.type}`}>
							<div class='images'>
								<img src={`/captcha/image?${start}`} />
								<Watermark loginName={captcha.loginName} />
							</div>
						</div>
					}
					<CaptchaInput
						ref={el => this.captchaInput = el}
						captcha={captcha}
						onChange={this.onInputChange}
					/>
				</div>
				<div class='modal-footer'>
					<Link href='/' className='btn btn-link pull-left'>Home</Link>
					<button className='btn btn-default' onClick={() => this.captchaInput.reset()}>Reset</button>
					<button className='btn btn-primary' onClick={this.verify} disabled={result.length === 0}>Next</button>
				</div>
			</div>
		)
	}
}
