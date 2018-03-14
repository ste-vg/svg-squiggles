
import './app.scss';
import { Pkg } from "../package";

const html = require('./app.html');

export class App
{
	private container:HTMLElement;

	constructor(container:HTMLElement)
	{
		this.container = container;
		this.container.innerHTML = html;
		console.log('APP STARTED', Pkg().version)
	}
}