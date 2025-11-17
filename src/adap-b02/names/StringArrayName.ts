import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { assertIsNotNullOrUndefined, assertIsValidIndex, unmaskComponent, maskComponent } from "./utils";

export class StringArrayName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];

    constructor(other: string[], delimiter?: string) {
        assertIsNotNullOrUndefined(other, "constructor StringArrayName");

        if(delimiter === null){
            throw new TypeError("delimiter must not be null");
        }
        if(delimiter !== undefined){
            if (typeof delimiter !== "string" || delimiter.length !== 1 || delimiter === ESCAPE_CHARACTER) {
                throw new TypeError("delimiter must be a single character (not escape)");
            }
            this.delimiter = delimiter;
        }

        if (!Array.isArray(other)) {
            throw new TypeError("StringArrayName constructor: other must be an array");
        }

        for(let i = 0; i < other.length; i++){
            assertIsNotNullOrUndefined(other[i], "constructor StringArrayName");
            if(typeof other[i] !== "string"){
                throw new TypeError("name components must be of type string");
            }
        }
        this.components = [...other];
    }

    public asString(delimiter: string = this.delimiter): string {
        assertIsNotNullOrUndefined(delimiter, "asString");
        if(typeof delimiter !== "string" || delimiter.length !== 1 || delimiter === ESCAPE_CHARACTER){
            throw new TypeError("asString: delimiter has to be a single character (not escape)");
        }

        return this.components
            .map(c => unmaskComponent(c, this.delimiter, true))
            .join(delimiter);
    }

    public asDataString(): string {
        // make sure that from data string a Name can be parsed back in
        // example: we have a\# bb c.c   |  3 components with delimiter #
        // after asDataString() the string will be a\#.bb.c.c  !! has 4 components instead of the original 3 !!
        // therefore it would not be possible to be parsed back in
        // solution: for the case where the delimiter is not "." , but "." is inside a component,
        // we have to mask "." to make sure we still maintain the same number of components
        // after asDataString() -> a\#.bb.c\.c    | note that here, because we masked "." in the 3rd component
        // it has 3 components again, and can be parsed back in
        if(this.delimiter === DEFAULT_DELIMITER){
            return this.components.join(DEFAULT_DELIMITER);
        }

        return this.components
            .map(c => unmaskComponent(c, this.delimiter))
            .map(c => maskComponent(c, DEFAULT_DELIMITER))
            .join(DEFAULT_DELIMITER);
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        assertIsNotNullOrUndefined(i, "getComponent");
        assertIsValidIndex(i, this.getNoComponents(), "getComponent");
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        assertIsNotNullOrUndefined(i, "setComponent");
        assertIsNotNullOrUndefined(c, "setComponent");
        assertIsValidIndex(i, this.getNoComponents(), "setComponent");

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

    public concat(other: Name): void {
        assertIsNotNullOrUndefined(other, "concat");

        if(other.getNoComponents() === 0){
            return;
        }

        let otherDelim = other.getDelimiterCharacter();
        for(let i = 0; i < other.getNoComponents(); i++){
            let comp = other.getComponent(i);
            if(this.delimiter !== otherDelim){
                let unmasked = unmaskComponent(comp, otherDelim);
                comp = maskComponent(unmasked, this.delimiter);
            }
            this.append(comp);
        }
    }
}