import { h, Component } from 'preact';
import { Link } from 'preact-router';

export default function (props) {
    return (
        <div class='watermark'>
            <div class='text'>
                { `${props.loginName}@${window.location.hostname}` }
            </div>
        </div>
    );
}