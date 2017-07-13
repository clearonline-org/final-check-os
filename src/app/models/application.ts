/**
 * An entity under which a bunch of api requests have been made, is an Application
 */
import { ApiRequest } from './api-request';
export interface ApplicationInterface {
    name: string;
    appCode: string; // used to identify the app and its data in the db
    apiRequestList: Array<ApiRequest>;
}
export class Application implements ApplicationInterface {

    public id: string;
    public name: string;
    public description: string;
    public appCode: string;
    public apiRequestList: Array<ApiRequest>;

    /**
     * Since apiRequestList, we init during instatiation, then add api requests afterwards
     * @param name {string}
     * @param description {string}
     */
    constructor(name: string, description: string = 'N/A', id: string = Math.random().toString().replace('\.', '')) {
        this.name = name;
        this.description = description;
        this.id = id;
        this.apiRequestList = [];
    }
}
