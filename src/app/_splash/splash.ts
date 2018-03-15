import { SplashSettings } from "./SplashSettings";
import { SplashState } from "./SplashState";
//import { TweenLite, TimelineLite, Power2 } from "gsap";

declare var TweenLite:any;
declare var Power2:any;

export class Splash
{
    private group:SVGElement;
    private blob:SVGPathElement;
    public state:SplashState;
    private settings:SplashSettings;

    constructor(stage:HTMLElement, settings:SplashSettings)
    {
        this.settings = settings;

        this.settings.speed = 0.7 + Math.random() * 1;
        this.settings.width = 0;
        this.settings.length = 100 + Math.random() * 20;
        this.settings.skew = 0;
        this.settings.opacity = 1;

        this.state = SplashState.active;

        this.group = document.createElementNS("http://www.w3.org/2000/svg", 'g');

        this.blob = document.createElementNS("http://www.w3.org/2000/svg", 'path')
        this.blob.setAttribute('d', 'M-10 -10 L -10 10, 10 10, 10 -10 Z')
        this.blob.style.fill = this.getColor();
        
        this.group.appendChild(this.blob);
        stage.appendChild(this.group);

        this.draw();

        let skewTo:number = (Math.random() * 40) - 20
        TweenLite.to(this.settings, 1 + Math.random(), 
        {
            y: '+=' + (30 + Math.random() * 30),
            width:  20 + Math.random() * 10,
            rotation: this.settings.rotation + skewTo, 
            skew: skewTo, 
            ease: Power2.easeOut,
            opacity: 0, 
            onComplete: () => { this.onEnd()}
        })
    }

    private getColor():string
    {
        let offset = Math.round(Math.random() * 100)
        var r = Math.sin(0.3 * offset) * 55 + 200;
        var g = Math.sin(0.3 * offset + 2) * 55 + 200;
        var b = Math.sin(0.3 * offset + 4) * 55 + 200;
        return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }

    private componentToHex(c:number) 
    {
        var hex = Math.round(c).toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    public update()
    {
        if(this.state == SplashState.active)
        {
            this.draw();
        }
    }

    private onEnd()
    {
        this.state = SplashState.ended;
        this.group.remove(); 
        this.blob = null;
        this.group = null;
    }

    private place(size:number, point:number, percent:number, skew:number)
    {
        size = size / 2;
        point = point + ((size / 100) * (percent + skew));

        return this.jigglize(point, 2);
    }

    private draw()
    {
        let path = [
            'M',
            this.place(this.settings.width, 0, 0, 0),
            this.place(this.settings.length, 0, 0, 0),
            'L',
            this.place(this.settings.width, 0, -100, this.settings.skew * 10),
            this.place(this.settings.length, 0, 100, 0),
            ',',
            this.place(this.settings.width, 0, 100, this.settings.skew * 10),
            this.place(this.settings.length, 0, 100, 0),
            ',',
            this.place(this.settings.width, 0, 0, 0),
            this.place(this.settings.length, 0, 0, 0),
            'Z'
        ]
        this.blob.setAttribute('d', path.join(' '));
        this.group.setAttribute('transform', `translate(${this.settings.x}, ${this.settings.y}) `);
        this.blob.setAttribute('transform', `rotate(${this.settings.rotation})`);
        this.blob.style.opacity = String(this.settings.opacity);
    }

    private jigglize(target:number, amount:number)
    {
        return target + ((Math.random() * amount) - (amount / 2))
    }

}