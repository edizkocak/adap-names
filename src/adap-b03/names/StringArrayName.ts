import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { assertIsNotNullOrUndefined, assertIsValidIndex} from "./utils";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter);

        assertIsNotNullOrUndefined(source, "constructor StringArrayName");
        if (!Array.isArray(source)) {
            throw new TypeError("StringArrayName constructor: source must be an array");
        }
        for(let i = 0; i < source.length; i++){
            assertIsNotNullOrUndefined(source[i], "constructor StringArrayName");
            if(typeof source[i] !== "string"){
                throw new TypeError("name components must be of type string");
            }
        }
        
        this.components = [...source];
    }

    public clone(): Name {
        return new StringArrayName([... this.components], this.delimiter);
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        assertIsNotNullOrUndefined(i, "getComponent");
        assertIsValidIndex(i, this.getNoComponents(), "get");
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        assertIsNotNullOrUndefined(i, "setComponent");
        assertIsNotNullOrUndefined(c, "setComponent");
        assertIsValidIndex(i, this.getNoComponents(), "set");

        this.components[i] = c;
    }

    public insert(i: number, c: string): void {
        assertIsNotNullOrUndefined(i, "insert");
        assertIsNotNullOrUndefined(c, "insert");
        assertIsValidIndex(i, this.getNoComponents() + 1, "insert");
        this.components.splice(i, 0, c);
    }

    public append(c: string): void {
        assertIsNotNullOrUndefined(c, "append");
        this.components.push(c);
    }

    public remove(i: number): void {
        assertIsNotNullOrUndefined(i, "remove");
        assertIsValidIndex(i, this.getNoComponents(), "remove");
        this.components.splice(i, 1);
    }
}