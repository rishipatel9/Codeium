import { IPty } from "node-pty";
import * as pty from 'node-pty';


class Terminal {
  private sessions: { [id: string]: { terminal: IPty, replId: string; } } = {};

  constructor() {}
  init(id: string, replId: string, onData: (data: string) => void) {
    const ptyProcess = pty.spawn('zsh', [], {
      name: 'xterm-color',
      cols: 80,
      rows: 30,
      cwd: `./`,
    });
    console.log("PTY process spawned");

    ptyProcess.onData((data: string) => {
      onData(data);
    });

    this.sessions[id] = {
      terminal: ptyProcess,
      replId
    };

    return ptyProcess;
  }

  write(id: string, data: string) {
    const session = this.sessions[id];
    if (session) {
      session.terminal.write(data);
      console.log(`Wrote data to terminal session ${id}: ${data}`);
    } else {
      console.error(`No terminal session found with id ${id}`);
    }
  }

  resize(id: string, cols: number, rows: number) {
    const session = this.sessions[id];

    if (session) {
      session.terminal.resize(cols, rows);
      console.log(`Resized terminal session ${id} to ${cols}x${rows}`);
    } else {
      console.error(`No terminal session found with id ${id}`);
    }
  }
  close(id: string) {
    const session = this.sessions[id];

    if (session) {
      session.terminal.kill();
      delete this.sessions[id];
      console.log(`Closed terminal session ${id}`);
    } else {
      console.error(`No terminal session found with id ${id}`);
    }
  }
}

export default Terminal;
