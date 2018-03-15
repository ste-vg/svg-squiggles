import { SqwiggleSettings } from "./Settings";
import { SqwiggleState } from "./State";

export class Sqwiggle
{
    private grid:number = 10;
    
    private sqwig:SVGElement;
    private settings:SqwiggleSettings;
    public state:SqwiggleState = SqwiggleState.ready;

    constructor(stage:HTMLElement, settings:SqwiggleSettings)
    {
        this.settings = settings;

        this.sqwig = document.createElementNS("http://www.w3.org/2000/svg", 'path')
        this.sqwig.setAttribute('d', this.createLine())
        this.sqwig.style.fill = 'none';
        this.sqwig.style.stroke = this.getColor();
        this.sqwig.style.strokeWidth = '5px';

        stage.appendChild(this.sqwig);

        this.state = SqwiggleState.animating;
    }

    public update()
    {

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

        let steps = 2 + Math.round(Math.random() * 5);
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
            
            if(step % 2 != 0)
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