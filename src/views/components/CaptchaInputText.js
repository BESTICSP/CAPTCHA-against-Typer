import { h, Component } from 'preact';
import { Link } from 'preact-router';

export default class CaptchaInputText extends Component {
	static defaultProps = {
		onChange: () => {},
	}
	reset () {
		this.setState({
			result: '',
		});
		this.props.onChange('');
	}
	render ({ captcha }, { result }) {
		return (
			<div class='captcha-input'>
				<div>{ captcha.description }</div>
				<br />
				<input type='text' class='form-control' value={result} onInput={evt => {
					this.setState({ result: evt.target.value });
					this.props.onChange(evt.target.value);
				}} />
			</div>
		)
	}
}
