import { ESCAPE_CHARACTER } from "../common/Printable";

export function unmaskComponent(component: string, delim: string, unmaskEscape : boolean = false): string {
    const result: string[] = [];
    for (let i = 0; i < component.length; i++) {
        if (component[i] === ESCAPE_CHARACTER) {
            const nextChar = component[i + 1];
            result.push(nextChar);
            if(nextChar === ESCAPE_CHARACTER && !unmaskEscape){
                result.push(ESCAPE_CHARACTER);
            }
            i++;
        } else {
            result.push(component[i]);
        }
    }
    return result.join('');
}

export function maskComponent(component: string, delim: string): string {
    const result: string[] = [];
    for (let i = 0; i < component.length; i++) {
        if (component[i] === ESCAPE_CHARACTER) {
            result.push(component[i], component[i + 1]);
            i++;
        } else if(component[i] === delim){
            result.push(ESCAPE_CHARACTER, component[i]);
        }
        else{
            result.push(component[i]);
        }
    }
    return result.join('');
}

export function assertIsValidIndex(index : number, upperBound : number, funcName : string) : void{
    if(typeof index !== "number" || !Number.isInteger(index)){
        throw new TypeError(`${funcName}: index must be an integer number")`);
    }
    if(index < 0 || index >= upperBound){
        throw new RangeError(`${funcName}: index out of range")`);
    }
}

export function assertIsNotNullOrUndefined(o : any, funcName : string) : void{
    if(o === null || o === undefined){
        throw new TypeError(`${funcName}: input null or undefined")`);
    }
}