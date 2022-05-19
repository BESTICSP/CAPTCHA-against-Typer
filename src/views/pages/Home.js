import { h } from 'preact';
import { Link } from 'preact-router';

export default function (props) {
	return (
		<div className='modal-content'>
			<div className='modal-header'>
				<h4 class="modal-title">Select Login Type</h4>
			</div>
			<div className='modal-body'>
				<Link href='/login/a' className='btn btn-default btn-block'>Login A</Link>
				<br />
				<Link href='/login/b' className='btn btn-default btn-block'>Login B</Link>
				<br />
				<Link href='/login/c' className='btn btn-default btn-block'>Login C</Link>
			</div>
		</div>
	);
}
