import { SquiggleSettings } from "./Settings";
import { SquiggleState } from "./State";
import { TweenLite, Power1 } from "gsap";

interface SquiggleSet
{
    path: SVGPathElement;
    settings: SquiggleSettings;
}

export class Squiggle
{
    private grid:number;
    private stage:HTMLElement;
    private sqwig:SVGPathElement;
    private sqwigs: SquiggleSet[] = [];
    private settings:SquiggleSettings;
    public state:SquiggleState = SquiggleState.ready;

    constructor(stage:HTMLElement, settings:SquiggleSettings, grid:number)
    {
        this.grid = grid;
        this.stage = stage;
   
        settings.width = 0;
        settings.opacity = 1;

        this.state = SquiggleState.animating;
        let path = this.createLine(settings);
        let sqwigCount:number = 3;
        for(let i = 0; i < sqwigCount; i++)
        {
            this.createSqwig(i, sqwigCount, path, JSON.parse(JSON.stringify(settings)) as SquiggleSettings, i == sqwigCount - 1)
        }
    }

    createSqwig(index:number, total:number, path:string, settings:SquiggleSettings, forceWhite:boolean)
    {
        let sqwig = document.createElementNS("http://www.w3.org/2000/svg", 'path')
            sqwig.setAttribute('d', path)
            sqwig.style.fill = 'none';
            sqwig.style.stroke = forceWhite ? '#303030' : this.getColor();
            sqwig.style.strokeLinecap = "round"
        
        settings.length =  sqwig.getTotalLength();
        settings.chunkLength = settings.length / 6; //(settings.sections * 2) + (Math.random() * 40);
        settings.progress = settings.chunkLength;

        sqwig.style.strokeDasharray= `${settings.chunkLength}, ${settings.length + settings.chunkLength}`
        sqwig.style.strokeDashoffset = `${settings.progress}`

        this.stage.appendChild(sqwig);

        this.sqwigs.unshift({path: sqwig, settings: settings});

        TweenLite.to(settings, settings.sections * 0.1, {
            progress: - settings.length,
            width: settings.sections * 0.9,
            ease: Power1.easeOut,
            delay: index * (settings.sections * 0.01),
            onComplete: () => 
            {
                if(index = total - 1) this.state = SquiggleState.ended;
                sqwig.remove();
            }
        })
    }

    public update()
    {
        this.sqwigs.map((set: SquiggleSet) => 
        {
            set.path.style.strokeDashoffset = `${set.settings.progress}`;
            set.path.style.strokeWidth = `${set.settings.width}px`;
            set.path.style.opacity = `${set.settings.opacity}`;
        })
        
    }

    private createLine(settings:SquiggleSettings):string
    {
        let x = settings.x;
        let y = settings.y;
        let dx = settings.directionX;
        let dy = settings.directionY;
        let path:string[] = [
            'M',
            '' + x,
            '' + y,
            "Q"
        ]

        let steps = settings.sections;
        let step = 0;
        let getNewDirection = (direction: string, goAnywhere:boolean) => 
        {
            if(!goAnywhere && settings['direction' + direction.toUpperCase()] != 0) return settings['direction' + direction.toUpperCase()];
            return Math.random() < 0.5 ? -1 : 1;
        }

        while(step < steps * 2)
        {
            step++;
            x += (dx * (step/ 30)) * this.grid;
            y += (dy * (step/ 30)) * this.grid;
            if(step != 1) path.push(',');
            path.push('' + x);
            path.push('' + y);
            
            if(step % 2 != 0)
            {
                dx = dx == 0 ? getNewDirection('x', step > 8) : 0;
                dy = dy == 0 ? getNewDirection('y', step > 8) : 0;
            }
        }
        
        return path.join(' ');
    }

    private getColor():string
    {
        let offset = Math.round(Math.random() * 100)
        var r = Math.sin(0.3 * offset) * 100 + 155;
        var g = Math.sin(0.3 * offset + 2) * 100 + 155;
        var b = Math.sin(0.3 * offset + 4) * 100 + 155;
        return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }

    private componentToHex(c:number) 
    {
        var hex = Math.round(c).toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
}