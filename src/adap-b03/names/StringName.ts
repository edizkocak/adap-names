import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { assertIsNotNullOrUndefined, assertIsValidIndex} from "./utils";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter);

        assertIsNotNullOrUndefined(source, "constructor StringName");
        this.name = source;

        this.noComponents = 1;

        let inEscape = false;
        for (let i = 0; i < this.name.length; i++) {
            if (inEscape) {
                inEscape = false;
            } else if (this.name[i] === ESCAPE_CHARACTER) {
                inEscape = true;
            } else if (this.name[i] === this.delimiter) {
                this.noComponents++;
            }
        }
    }

    public clone(): Name {
        let cloned = new StringName(this.name, this.delimiter);

        if(this.getNoComponents() === 0){ // special edge case for an empty StringName "" with 0 components
            cloned.remove(0); // now cloned object is also an empty StringName
        }

        return cloned;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(x: number): string {
        assertIsNotNullOrUndefined(x, "getComponent");
        assertIsValidIndex(x, this.getNoComponents(), "getComponent");

        let current_index = 0;
        let i = 0;

        for(i = 0; i < this.name.length && current_index < x; i++){
            if(this.name[i] === ESCAPE_CHARACTER){
                i++;
                continue;
            }
            if(this.name[i] === this.delimiter){
                current_index++;
            }
        }

        const result: string[] = [];

        for(; i < this.name.length; i++){
            if(this.name[i] === ESCAPE_CHARACTER){
                result.push(this.name[i], this.name[i+1]);
                i++;
                continue;
            }
            if(this.name[i] === this.delimiter){
                break;
            }
            result.push(this.name[i]);
        }

        return result.join("");
    }

    public setComponent(n: number, c: string): void {
        assertIsNotNullOrUndefined(n, "setComponent");
        assertIsNotNullOrUndefined(c, "setComponent");
        assertIsValidIndex(n, this.getNoComponents(), "set");

        let i = 0;
        let current_index = 0;
        const result: string[] = [];

        // get everything up to component i
        for(i = 0; i < this.name.length && current_index < n; i++){
            if(this.name[i] === ESCAPE_CHARACTER){
                result.push(ESCAPE_CHARACTER);
                result.push(this.name[i+1]);
                i++;
                continue;
            }
            if(this.name[i] === this.delimiter){
                current_index++;
            }
            result.push(this.name[i]);
        }

        // set component i
        result.push(c);

        // ignore old component i
        for(; i < this.name.length; i++){
            if(this.name[i] === ESCAPE_CHARACTER){
                i++;
                continue;
            }
            if(this.name[i] === this.delimiter){
                result.push(this.delimiter);
                i++;
                break;
            }
        }

        // get rest of the string
        for(; i < this.name.length; i++){
            result.push(this.name[i]);
        }

        this.name = result.join("");
    }

    public insert(n: number, c: string): void {
        assertIsNotNullOrUndefined(c, "insert");
        assertIsNotNullOrUndefined(n, "insert");
        assertIsValidIndex(n, this.getNoComponents() + 1, "insert");
    
        if(n === this.getNoComponents()){
            this.append(c);
            return;
        }

        let i = 0;
        let current_index = 0;
        const result: string[] = [];

        // get everything up to component i
        for(i = 0; i < this.name.length && current_index < n; i++){
            if(this.name[i] === ESCAPE_CHARACTER){
                result.push( ESCAPE_CHARACTER);
                result.push(this.name[i+1]);
                i++;
                continue;
            }
            if(this.name[i] === this.delimiter){
                current_index++;
            }
            result.push(this.name[i]);
        }

        // set component i
        result.push(c);
        result.push(this.delimiter);

        // get rest of the string
        for(; i < this.name.length; i++){
            result.push(this.name[i]);
        }

        this.name = result.join("");
        this.noComponents++;
    }

    public append(c: string): void {
        assertIsNotNullOrUndefined(c, "append");
        if(this.noComponents !== 0){
            this.name += this.delimiter;
        }
        this.name += c;
        this.noComponents++;
    }

    public remove(n: number): void {
        assertIsNotNullOrUndefined(n, "remove");
        assertIsValidIndex(n, this.getNoComponents(), "remove");

        let i = 0;
        let current_index = 0;
        const result: string[] = [];

        // get everything up to component n
        for(i = 0; i < this.name.length && current_index < n; i++){
            if(this.name[i] === ESCAPE_CHARACTER){
                result.push(ESCAPE_CHARACTER);
                result.push(this.name[i+1]);
                i++;
                continue;
            }
            if(this.name[i] === this.delimiter){
                current_index++;
            }
            if(current_index === n && n === this.noComponents - 1){ // comp1.comp2 -> comp1
                this.name = result.join("");
                this.noComponents--;
                return;
            }
            result.push(this.name[i]);
        }

        // ignore old component n
        for(; i < this.name.length; i++){
            if(this.name[i] === ESCAPE_CHARACTER){
                i++;
                continue;
            }
            if(this.name[i] === this.delimiter){
                i++;
                break;
            }
        }

        // get rest of the string
        for(; i < this.name.length; i++){
            result.push(this.name[i]);
        }

        this.name = result.join("");
        this.noComponents--;
    }
}