import { SqwiggleSettings } from "./Settings";
import { SqwiggleState } from "./State";
import { TweenLite, Power2 } from "gsap";

export class Sqwiggle
{
    private grid:number = 40;
    
    private sqwig:SVGPathElement;
    private settings:SqwiggleSettings;
    public state:SqwiggleState = SqwiggleState.ready;

    constructor(stage:HTMLElement, settings:SqwiggleSettings)
    {
        this.settings = settings;

        this.sqwig = document.createElementNS("http://www.w3.org/2000/svg", 'path')
        this.sqwig.setAttribute('d', this.createLine())
        this.sqwig.style.fill = 'none';
        this.sqwig.style.stroke = this.getColor();
        this.sqwig.style.strokeWidth = '20px';
        this.sqwig.style.strokeLinecap = "round"
        
        this.settings.length = this.sqwig.getTotalLength();
        this.settings.chunkLength = this.settings.length / 3; //(this.settings.sections * 2) + (Math.random() * 40);
        this.settings.progress = - this.settings.length;

        this.sqwig.style.strokeDasharray= `${this.settings.chunkLength}, ${this.settings.length + this.settings.chunkLength}`
        this.sqwig.style.strokeDashoffset = `${this.settings.progress}`

        stage.appendChild(this.sqwig);

        this.state = SqwiggleState.animating;

        TweenLite.to(this.settings, this.settings.sections * 0.25, {
            progress: this.settings.chunkLength,
            ease: Power2.easeInOut,
            onComplete: () => 
            {
                this.state = SqwiggleState.ended;
                this.sqwig.remove();
            }
        })
    }

    public update()
    {
        this.sqwig.style.strokeDashoffset = `${this.settings.progress}`;
    }

    private createLine():string
    {
        let x = this.settings.x;
        let y = this.settings.y;
        let dx = this.settings.directionX;
        let dy = this.settings.directionY;
        let path:string[] = [
            'M',
            '' + x,
            '' + y,
            "Q"
        ]

        let steps = this.settings.sections;
        let step = 0;
        let getNewDirection = () => Math.random() < 0.5 ? -1 : 1;

        while(step < steps * 2)
        {
            step++;
            x += dx * this.grid;
            y += dy * this.grid;
            if(step != 1) path.push(',');
            path.push('' + x);
            path.push('' + y);
            
            if(step > 1 && step % 2 != 0)
            {
                dx = dx == 0 ? getNewDirection() : 0;
                dy = dy == 0 ? getNewDirection() : 0;
            }
        }
        
        return path.join(' ');
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
}