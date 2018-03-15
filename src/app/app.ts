
import './app.scss';
import { Pkg } from "../package";
// import { Splash } from './splash/splash';
// import { SplashSettings } from './splash/SplashSettings';
// import { SplashState } from './splash/SplashState';
import { Sqwiggle } from "./sqwiggle/sqwiggle";
import { SqwiggleSettings } from "./sqwiggle/Settings";
import { SqwiggleState } from './sqwiggle/State';
import { Position } from './Position';
import { Input } from './input';

const html = require('./app.html');

export class App
{
	private container:HTMLElement;
	private svg:HTMLElement;
	private sqwiggles:Sqwiggle[] = [];

	private width: number = 600;
	private height: number = 600;

	private lastMousePosition:Position;
	private direction:Position;

	constructor(container:HTMLElement)
	{
		console.log(Pkg().version);

		this.container = container;
		this.container.innerHTML = html;
		this.svg = document.getElementById('stage');
		this.onResize();

		this.tick();

		let input = new Input(this.container);
		
		//input.moves.subscribe((position:Position) => this.createSqiggFromMouse(position))
		setInterval(() => this.createRandomSqwig(), 150)
	}

	createSqiggFromMouse(position:Position)
	{
		let sections:number = 2;
		if(this.lastMousePosition)
		{
			let newDirection:Position = {x: 0, y: 0};
			let xAmount = Math.abs(this.lastMousePosition.x - position.x);
			let yAmount = Math.abs(this.lastMousePosition.y - position.y);

			if(xAmount > yAmount)
			{
				newDirection.x = this.lastMousePosition.x - position.x < 0 ? 1 : -1;
				sections += Math.round(xAmount)
			}
			else
			{
				newDirection.y = this.lastMousePosition.y - position.y < 0 ? 1 : -1;
				sections += Math.round(yAmount)
			}
			this.direction = newDirection;
		}

		if(this.direction)
		{
			let settings:SqwiggleSettings = {
				x: this.lastMousePosition.x,
				y: this.lastMousePosition.y,
				directionX: this.direction.x,
				directionY: this.direction.y,
				sections: sections
			}
			let newSqwig = new Sqwiggle(this.svg, settings);
			this.sqwiggles.push(newSqwig);
		}
		
		this.lastMousePosition = position;
	}

	createRandomSqwig()
	{

		let settings:SqwiggleSettings = {
			x: Math.random() * this.width,
			y: Math.random() * this.height,
			directionX: 1,
			directionY: 0,
			sections: 10 + Math.round(Math.random() * 10)
		}
		let newSqwig = new Sqwiggle(this.svg, settings);
		this.sqwiggles.push(newSqwig);
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
		// if(this.direction && this.sqwiggles.length < this.lineCount)
		// {
			
		// }

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