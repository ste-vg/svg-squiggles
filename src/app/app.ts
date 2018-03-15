
import './app.scss';
import { Pkg } from "../package";
// import { Splash } from './splash/splash';
// import { SplashSettings } from './splash/SplashSettings';
// import { SplashState } from './splash/SplashState';
import { Sqwiggle } from "./sqwiggle/sqwiggle";
import { SqwiggleSettings } from "./sqwiggle/Settings";
import { SqwiggleState } from './sqwiggle/State';

const html = require('./app.html');

export class App
{
	private container:HTMLElement;
	private svg:HTMLElement;
	private sqwiggles:Sqwiggle[] = [];
	private lineCount:number = 10;	

	private width: number = 600;
	private height: number = 600;

	constructor(container:HTMLElement)
	{
		console.log(Pkg().version);

		this.container = container;
		this.container.innerHTML = html;
		this.svg = document.getElementById('stage');
		this.onResize();

		this.tick();
	}

	onResize()
	{
		this.width = this.container.offsetWidth;
		this.height = this.container.offsetHeight;

		this.svg.setAttribute('width', String(this.width));
		this.svg.setAttribute('height', String(this.height));
	}

	tick()
	{
		if(this.sqwiggles.length < this.lineCount)
		{
			let settings:SqwiggleSettings = {
				x: this.width / 2,
				y: this.height / 2,
				directionX: 1,
				directionY: 0
			}
			let newSqwig = new Sqwiggle(this.svg, settings);
			this.sqwiggles.push(newSqwig);
		}

		let step = this.sqwiggles.length - 1;

		while(step >= 0)
		{
			if(this.sqwiggles[step].state != SqwiggleState.ended)
			{
				this.sqwiggles[step].update();
				
			}
			else
			{
				this.sqwiggles[step] = null;
				this.sqwiggles.splice(step, 1);
			}

			--step;	
		}

		requestAnimationFrame(() => this.tick());
	}
}