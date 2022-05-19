import { h, Component } from 'preact';
import { Link } from 'preact-router';

export default class Result extends Component {
	state = { result: {} }
	componentDidMount () {
		this.loadResult();
	}
	async loadResult () {
		const resp = await fetch(`/results/${this.props.id}`)
		const respData = await resp.json();
		this.setState({ result: respData });
	}
	render (props, { result }) {
		return (
			<div className='modal-content'>
				<div className='modal-header'>
					<h4 class="modal-title">Result</h4>
				</div>
				<div className='modal-body'>
					<table class="result">
						<tr><td class="label">Result:</td><td class={result.result ? 'value correct' : 'value incorrect'}>{ result.result ? 'Correct' : 'Incorrect' }</td></tr>
						<tr><td class="label">Time:</td><td class="value">{ result.time * 1.0 / 1000 } seconds</td></tr>
						<tr><td class="label">Round:</td><td class="value">{ result.round + 1 }</td></tr>
					</table>
				</div>
				<div className='modal-footer'>
					<Link href='/' className='btn btn-link pull-left'>Home</Link>
					{ result.round >= 4 && <Link href={`/`} className='btn btn-primary'>Home</Link> }
					{ result.round < 4 && <Link href={`/captcha/${result.captcha.type}`} className='btn btn-primary'>Next Round</Link> }
				</div>
			</div>
		)
	}
}
