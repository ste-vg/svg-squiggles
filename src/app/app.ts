
import './app.scss';
import { Pkg } from "../package";
import { Squiggle } from "./squiggles/squiggle";
import { SquiggleSettings } from "./squiggles/Settings";
import { SquiggleState } from './squiggles/State';
import { Position } from './Position';
import { Input } from './input';

import { Observable } from "rxjs";

const html = require('./app.html');

export class App
{
	private container:HTMLElement;
	private svg:HTMLElement;
	private squiggles:Squiggle[] = [];

	private width: number = 600;
	private height: number = 600;

	private lastMousePosition:Position;
	private direction:Position;

	private grid:number = 40;

	constructor(container:HTMLElement)
	{
		console.log(Pkg().version);

		this.container = container;
		this.container.innerHTML = html;
		this.svg = document.getElementById('stage');
		this.onResize();

		this.tick();

		let input = new Input(this.container);
		
		input.moves.subscribe((position:Position) => 
		{
			for(let i = 0; i < 3; i++) this.createSqwigFromMouse(position);
		})
		if(location.pathname.match(/fullcpgrid/i)) setInterval(() => this.createRandomSqwig(), 100)

		Observable.fromEvent(window, "resize").subscribe(() => this.onResize())
	}

	createSqwigFromMouse(position:Position)
	{
		let sections:number = 4;
		if(this.lastMousePosition)
		{
			let newDirection:Position = {x: 0, y: 0};
			let xAmount = Math.abs(this.lastMousePosition.x - position.x);
			let yAmount = Math.abs(this.lastMousePosition.y - position.y);

			if(xAmount > yAmount)
			{
				newDirection.x = this.lastMousePosition.x - position.x < 0 ? 1 : -1;
				sections += Math.round(xAmount/4)
			}
			else
			{
				newDirection.y = this.lastMousePosition.y - position.y < 0 ? 1 : -1;
				sections += Math.round(yAmount/4)
			}
			this.direction = newDirection;
		}

		if(this.direction)
		{
			let settings:SquiggleSettings = {
				x: this.lastMousePosition.x,
				y: this.lastMousePosition.y,
				directionX: this.direction.x,
				directionY: this.direction.y,
				sections: sections > 20 ? 20 : sections
			}
			let newSqwig = new Squiggle(this.svg, settings, 10 + Math.random() * (sections * 1.5));
			this.squiggles.push(newSqwig);
		}
		
		this.lastMousePosition = position;
	}

	createRandomSqwig()
	{
		let dx = Math.random();
		if(dx > 0.5) dx = dx > 0.75 ? 1 : -1;
		let dy = 0;
		if(dx == 0) dx = Math.random() > 0.5 ? 1 : -1;

		let settings:SquiggleSettings = {
			x: Math.round(Math.random() * (this.width / this.grid))  * this.grid,
			y: Math.round(Math.random() * (this.height / this.grid)) * this.grid,
			directionX: dx,
			directionY: dy,
			sections: 10 + Math.round(Math.random() * 10)
		}
		let newSqwig = new Squiggle(this.svg, settings, this.grid/2 + Math.random() * this.grid);
		this.squiggles.push(newSqwig);
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
		// if(this.direction && this.squiggles.length < this.lineCount)
		// {
			
		// }

		let step = this.squiggles.length - 1;

		while(step >= 0)
		{
			if(this.squiggles[step].state != SquiggleState.ended)
			{
				this.squiggles[step].update();
				
			}
			else
			{
				this.squiggles[step] = null;
				this.squiggles.splice(step, 1);
			}

			--step;	
		}

		requestAnimationFrame(() => this.tick());
	}
}