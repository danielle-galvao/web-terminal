export type CommandStatus = 'pending' | 'completed' | 'running';

export interface Command {
    command: string,
    serverId: number,
    output: {
        combined: string,
        stdout: string,
        stderr: string,
        breakpoints? : {
            location: string,
            combined: string,
            stdout: string,
            stderr: string
        }[]
    },
    breakpoints? : number[],
    begin: string,
    end: string,
    status: CommandStatus
}