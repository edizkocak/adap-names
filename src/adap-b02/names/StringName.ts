import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { assertIsNotNullOrUndefined, assertIsValidIndex, unmaskComponent, maskComponent } from "./utils";


export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        assertIsNotNullOrUndefined(source, "StringName constructor");
        
        this.name = source;

        if(delimiter === null){
            throw new TypeError("delimiter must not be null");
        }
        if(delimiter !== undefined){
            if (typeof delimiter !== "string" || delimiter.length !== 1 || delimiter === ESCAPE_CHARACTER) {
                throw new TypeError("delimiter must be a single character (not escape)");
            }
            this.delimiter = delimiter;
        }

        // count number of components
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

    public asString(delimiter: string = this.delimiter): string {
        assertIsNotNullOrUndefined(delimiter, "asString");
        if(typeof delimiter !== "string" || delimiter.length !== 1 || delimiter === ESCAPE_CHARACTER){
            throw new TypeError("asString: delimiter has to be a single character (not escape)")
        }

        const name_components = [];
        for(let i = 0; i < this.getNoComponents(); i++){
            name_components.push(unmaskComponent(this.getComponent(i), this.delimiter, true));
        }
        return name_components.join(delimiter);
    }

    public asDataString(): string {
        const name_components = [];
        for(let i = 0; i < this.getNoComponents(); i++){
            if(this.delimiter === DEFAULT_DELIMITER){
                name_components.push(this.getComponent(i));
            }
            else{
                name_components.push(maskComponent(
                    unmaskComponent(this.getComponent(i), this.delimiter), DEFAULT_DELIMITER));
            }
        }

        return name_components.join(DEFAULT_DELIMITER);
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.noComponents === 0;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(x: number): string {
        assertIsNotNullOrUndefined(x, "getComponent");
        assertIsValidIndex(x, this.getNoComponents(), "getComponent");

        let current_index = 0;
        let i = 0;

        // skip until component i
        for(i = 0; i < this.name.length && current_index < x; i++){
            if(this.name[i] === ESCAPE_CHARACTER){
                i++;
                continue;
            }
            if(this.name[i] === this.delimiter){
                current_index++;
            }
        }

        let result = "";

        // get component at index i
        for(; i < this.name.length; i++){
            if(this.name[i] === ESCAPE_CHARACTER){
                result += this.name[i] + this.name[i+1];
                i++;
                continue;
            }
            if(this.name[i] == this.delimiter){
                break;
            }
            result += this.name[i];
        }

        return result;
    }

    public setComponent(n: number, c: string): void {
        assertIsNotNullOrUndefined(n, "setComponent");
        assertIsNotNullOrUndefined(c, "setComponent");
        assertIsValidIndex(n, this.getNoComponents(), "setComponent");

        let i = 0;
        let current_index = 0;
        let result = "";

        // get everything up to component i
        for(i = 0; i < this.name.length && current_index < n; i++){
            if(this.name[i] === ESCAPE_CHARACTER){
                result += ESCAPE_CHARACTER;
                result += this.name[i+1];
                i++;
                continue;
            }
            if(this.name[i] === this.delimiter){
                current_index++;
            }
            result += this.name[i];
        }

        // set component i
        result += c;

        // ignore old component i
        for(; i < this.name.length; i++){
            if(this.name[i] === ESCAPE_CHARACTER){
                i++;
                continue;
            }
            if(this.name[i] === this.delimiter){
                result += this.delimiter;
                i++;
                break;
            }
        }

        // get rest of the string
        for(; i < this.name.length; i++){
            result += this.name[i];
        }

        this.name = result;
    }

    public insert(n: number, c: string): void {
        assertIsNotNullOrUndefined(n, "insert");
        assertIsNotNullOrUndefined(c, "insert");
        assertIsValidIndex(n, this.getNoComponents() + 1, "insert"); // allow inserting at the end of the string
    
        if(n === this.getNoComponents()){
            this.append(c);
            return;
        }

        let i = 0;
        let current_index = 0;
        let result = "";

        // get everything up to component i
        for(i = 0; i < this.name.length && current_index < n; i++){
            if(this.name[i] === ESCAPE_CHARACTER){
                result += ESCAPE_CHARACTER;
                result += this.name[i+1];
                i++;
                continue;
            }
            if(this.name[i] === this.delimiter){
                current_index++;
            }
            result += this.name[i];
        }

        // set component i
        result += c;
        result += this.delimiter;

        // get rest of the string
        for(; i < this.name.length; i++){
            result += this.name[i];
        }

        this.name = result;
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
        let result = "";

        // get everything up to component n
        for(i = 0; i < this.name.length && current_index < n; i++){
            if(this.name[i] === ESCAPE_CHARACTER){
                result += ESCAPE_CHARACTER;
                result += this.name[i+1];
                i++;
                continue;
            }
            if(this.name[i] === this.delimiter){
                current_index++;
            }
            if(current_index === n && n === this.noComponents - 1){ // comp1.comp2 -> comp1
                this.name = result;
                this.noComponents--;
                return;
            }
            result += this.name[i];
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
            result += this.name[i];
        }

        this.name = result;
        this.noComponents--;
    }

    public concat(other: Name): void {
        assertIsNotNullOrUndefined(other, "concat");

        if(other.getNoComponents() === 0){
            return;
        }

        const otherDelimiter = other.getDelimiterCharacter();

        for(let i = 0; i < other.getNoComponents(); i++){
            let comp = other.getComponent(i);
            if(this.delimiter !== otherDelimiter){
                let unmasked = unmaskComponent(comp, otherDelimiter);
                comp = maskComponent(unmasked, this.delimiter);
            }
            this.append(comp);
        }
    }
}