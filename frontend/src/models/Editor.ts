
import { ConnectionInterface } from './Connection'
import { Results, ResultsInterface } from './Results'
import axiosHelpers from '/src/api/helpers';
import instance from '/src/api/instance';

export interface EditorInterface {
    name: string;
    type: string;
    syntax: string;
    connection: string;
    results: ResultsInterface;
    contents: string;
    loading: boolean;
    error: string | null;
    status_code: number;
    executed: boolean;
    // monaco: editor.IStandaloneCodeEditor | null;
}

export interface EditorEnrichedInterface {
    name: string;
    type: string;
    connection: ConnectionInterface;
    results: ResultsInterface;
    contents: string;
    loading: boolean;
    error: string | null;
    executed: boolean;
    // monaco: editor.IStandaloneCodeEditor | null;
}

export class Editor implements EditorInterface {
    name: string;
    type: string;
    syntax: string;
    connection: string;
    results: Results;
    contents: string;
    loading: boolean;
    error: string | null;
    status_code: number;
    executed: boolean;
    duration: number | null;
    generated_sql: string | null;
    visible: boolean;
    // monaco: editor.IStandaloneCodeEditor | null;


    constructor(name: string, type: string, connection: string) {
        this.name = name
        this.type = type
        this.syntax = 'preql'
        this.connection = connection
        this.results = new Results([], new Map())
        this.contents = 'SELECT 1 -> echo;'
        this.loading = false;
        this.error = null;
        this.executed = false;
        this.duration = null;
        // this.monaco = null;
        this.status_code = 200;
        this.generated_sql = null;
        this.visible = true;
    }

    async runQuery() {
        this.loading = true;
        // this.info = 'Executing query...'
        this.error = null;
        // let current_query = this.editorData.contents;
        this.executed = true;
        let local = this;
        const startTime = new Date();
        try {
            let info = { connection: local.connection, query: local.contents };
            await instance.post('query', info).then(function (response) {
                local.status_code = 200;
                const columnMap = new Map();
                for (const [key, value] of response.data.columns) {
                    columnMap.set(key, value);
                }
                local.generated_sql = response.data.generated_sql;
                local.results = new Results(response.data.results, columnMap);
                const endTime = new Date();
                local.duration = endTime.getTime() - startTime.getTime();
                local.executed = true;
            })
            // this.last_passed_query_text = current_query;
        } catch (error) {
            if (error instanceof Error) {
                const resultCode = axiosHelpers.getResultCode(error);
                local.status_code = resultCode;
                local.error = axiosHelpers.getErrorMessage(error);
                local.duration = null;
                local.executed = false;
            }
        } finally {
            local.loading = false;
        }
    }

    static fromJSON({ name, type, connection, contents, results, visible }): Editor {
        let output = new Editor(name, type, connection);
        output.contents = contents
        output.results = results
        output.visible = visible
        return output
    }


}


export class RawEditor implements EditorInterface {
    name: string;
    type: string;
    syntax: string;
    connection: string;
    results: Results;
    contents: string;
    loading: boolean;
    error: string | null;
    executed: boolean;
    duration: number | null;
    // monaco: editor.IStandaloneCodeEditor | null;
    status_code: number;
    visible: boolean;

    constructor(name: string, type: string, connection: string) {
        this.name = name
        this.type = type
        this.syntax = 'sql'
        this.connection = connection
        this.results = new Results([], new Map())
        this.contents = 'SELECT 1;'
        this.loading = false;
        this.error = null;
        this.executed = false;
        this.duration = null;
        // this.monaco = null;
        this.status_code = 200;
        this.visible = true;
    }

    async runQuery() {
        this.loading = true;
        this.error = null;
        this.executed = true;
        let local = this;
        const startTime = new Date();
        try {
            let info = { connection: local.connection, query: local.contents };
            await instance.post('raw_query', info).then(function (response) {
                const columnMap = new Map();
                for (const [key, value] of response.data.columns) {
                    columnMap.set(key, value);
                }
                local.status_code = 200;
                local.results = new Results(response.data.results, columnMap); //response.data;
                const endTime = new Date();
                local.duration = endTime.getTime() - startTime.getTime();
                local.executed = true;
            })
            // this.last_passed_query_text = current_query;
        } catch (error) {
            if (error instanceof Error) {

                const resultCode = axiosHelpers.getResultCode(error);
                local.status_code = resultCode;
                local.error = axiosHelpers.getErrorMessage(error);
                local.duration = null;
                local.executed = false;
            }
        } finally {
            local.loading = false;
        }
    }


    static fromJSON({ name, type, connection, contents, results, visible }): RawEditor {
        let output = new RawEditor(name, type, connection);
        output.contents = contents
        output.results = results
        output.visible = visible
        return output
    }

}
