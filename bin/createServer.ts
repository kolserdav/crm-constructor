import * as ioServer from 'socket.io';
import * as http from 'http';
import * as https from 'https';
import * as express from 'express';
import * as process from 'process';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

export default abstract class CreateServer {

	protected devel: boolean;
	protected httpsPort: number;
	protected httpPort: number;
	protected app_: express.Application;
	public origin: string;

	constructor() {
		const { env } = process;
		this.httpsPort = parseInt( env.HTTPS_PORT );
		this.httpPort = parseInt( env.HTTP_PORT );
		this.devel = env.DEVEL === 'yes';
		this.app_ = express();
		this.origin = ( this.devel )? env.LOCAL_ORIGIN : env.REMOTE_ORIGIN;
	}

	protected get application() {
		return this.app_;
	}

	/**
	* Get TLS certificate credentials for the https.Server constructor.
	*/

	protected getSSLOptions(): object {
		return {
			key: fs.readFileSync('./ssl/key.pem'),
			cert: fs.readFileSync('./ssl/cert.pem')
		};
	}
	
	/**
	* Create server for the https conections.
	*/
	
	protected createHTTPSServer( app: express.Application ): https.Server {
		const server = new https.Server( this.getSSLOptions(), app );
		server.listen( this.httpsPort );
		return server;
	}

	/**
	* Create server for the http conections;
	*/

	protected createHTTPServer( app: express.Application ): http.Server {
		const server = new http.Server( app );
		server.listen( this.httpPort );
		return server;
	}

	/**
	* Creation of an socket.io server.
	*/

	protected createSocketServer( app: express.Application ): ioServer {
		const io = new ioServer();
		io.attach( this.createHTTPSServer( app ) );
		io.attach( this.createHTTPServer( app ) );
		return io;
	}
}
