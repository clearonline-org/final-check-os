/**
 * anything that takes input and spit out output, is an api request
 * we add a "metaData" attribute so that any other information can be stored here
 */

// an http request is an api request with specific input and output data
export interface HttpInputInterface   { method: string; headers: JSON; payload: JSON; }
export interface HttpOutputInterface  { headers: JSON; payload: JSON; statusCode: string; }
export interface HttpRequestInterface {
    uri: string;
    input: HttpInputInterface;
    output: HttpOutputInterface;
    latency: number;
    metaData: any;
}

export interface ApiRequestInterface {
    uri: string;
    input: HttpInputInterface;
    output: HttpOutputInterface;
    latency: number;
    metaData: any;
}
export class ApiRequest implements ApiRequestInterface {

    public id: string;
    public uri: string;
    public input: HttpInputInterface;
    public output: HttpOutputInterface;
    public latency: number;
    public metaData: any;

    /**
     * we only require uri and input because a request may not have output at the time
     * we log it
     * id is randomly generated during instatiation, if none is provided
     * @param uri {string}
     * @param input {HttpInputInterface}
     */
    constructor(uri: string, input: HttpInputInterface, id: string = Math.random().toString().replace('\.', '')) {
        this.uri = uri;
        this.input = input;

        this.id = id;
        this.metaData = {}; // put everything else in here
    }

}
