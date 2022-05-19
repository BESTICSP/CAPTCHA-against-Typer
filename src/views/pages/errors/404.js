import { h } from 'preact';

export default function (props) {
	return (
		<div className='page'>
			<div className='well'>
				<h1>404 Page</h1>
				<p>Looks like you were given a bad link ;-)</p>
				<pre>{ props.url }</pre>
			</div>
		</div>
	);
}
