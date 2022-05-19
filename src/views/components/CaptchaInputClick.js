import { h, Component } from 'preact';
import { Link } from 'preact-router';
import Watermark from './Watermark';

export default class CaptchaInputClick extends Component {
	static defaultProps = {
		onChange: () => {},
		captcha: {
			size: 0,
		},
	}
	state = {
		source: [],
		target: [],
	}
	componentDidMount () {
		this.setState({
			random: Math.random(),
		});
	}
	componentWillReceiveProps ({ captcha }) {
		if (captcha !== this.props.captcha) {
			this.setState({
				source: [...new Array(captcha.size).keys()],
				target: [],
			});
		}
	}
	select (no) {
		if (
			this.state.target.length === this.props.size ||
			this.state.target.indexOf(no) !== -1
		) return;
		this.setState({
			target: [...this.state.target, no],
		});
		this.props.onChange(this.state.target);
	}
	deselect (no) {
		const idx = this.state.target.indexOf(no);
		this.setState({
			target: [...this.state.target.slice(0, idx), ...this.state.target.slice(idx + 1)],
		});
		this.props.onChange(this.state.target);
	}
	reset () {
		this.setState({
			source: [...new Array(this.props.captcha.size).keys()],
			target: [],
			random: Math.random(),
		});
		this.props.onChange(this.state.target);
	}
	render ({ captcha }, { source, target, random }) {
		return (
			<div class='captcha-input'>
				<div>{ captcha.description }</div>
				<div className={`captcha captcha-${captcha.type}`}>
					<div className='images'>
						{
							source.map(no => {
								return <a onClick={() => this.select(no)}>
									<img key={no} src={`/captcha/slices/${no}?${random}`} />
								</a>
							})
						}
					</div>
					{ captcha.type === 'a' && <Watermark loginName={captcha.loginName} /> }
				</div>
				<div className='drop-zone captcha'>
					<div className='images'>
						{
							target.map(no => {
								return <a onClick={() => this.deselect(no)}>
									<img key={no} src={`/captcha/slices/${no}?${random}`} />
								</a>
							})
						}
					</div>
				</div>
			</div>
		)
	}
}
