import { Observable } from "rxjs";
import { Position } from "./Position";

// code form https://codepen.io/HunorMarton/post/handling-complex-mouse-and-touch-events-with-rxjs

export class Input
{
    private mouseDowns:Observable<Position>;
    private mouseMoves:Observable<Position>;
    private mouseUps:Observable<Position>;

    private touchStarts:Observable<Position>;
    private touchMoves:Observable<Position>;
    private touchEnds:Observable<Position>;

    public starts:Observable<Position>;
    public moves:Observable<Position>;
    public ends:Observable<Position>;

    constructor(element:HTMLElement)
    {
        this.mouseDowns = Observable.fromEvent(element, "mousedown").map(this.mouseEventToCoordinate);
        this.mouseMoves = Observable.fromEvent(window, "mousemove").map(this.mouseEventToCoordinate);
        this.mouseUps = Observable.fromEvent(window, "mouseup").map(this.mouseEventToCoordinate);

        this.touchStarts = Observable.fromEvent(element, "touchstart").map(this.touchEventToCoordinate);
        this.touchMoves = Observable.fromEvent(element, "touchmove").map(this.touchEventToCoordinate);
        this.touchEnds = Observable.fromEvent(window, "touchend").map(this.touchEventToCoordinate);

        this.starts = this.mouseDowns.merge(this.touchStarts);
        this.moves = this.mouseMoves.merge(this.touchMoves);
        this.ends = this.mouseUps.merge(this.touchEnds);
    }

    private mouseEventToCoordinate = (mouseEvent:MouseEvent) => 
    {
        mouseEvent.preventDefault();
        return {
            x: mouseEvent.clientX, 
            y: mouseEvent.clientY
        };
    };

    private touchEventToCoordinate = (touchEvent:TouchEvent) => 
    {
        touchEvent.preventDefault();
        return {
            x: touchEvent.changedTouches[0].clientX, 
            y: touchEvent.changedTouches[0].clientY
        };
    };
}