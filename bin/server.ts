import * as express from 'express';
import CreateServer from './createServer';


interface ServerInterface {
	socketServer(): void,
	router( expressApp: express.Application ): express.Application;
}

export default class Server extends CreateServer implements ServerInterface {

	protected app: express.Application;

	/**
	* Creation of an express server and also contains all the routes.
	*/

	public router( expressApp: express.Application ): express.Application {
		const app = expressApp;
		app.get('/test', ( req: express.Request, res: express.Response ) => {
			res.status( 200 );
			res.set( { 
				'Content-Type': 'application/json',
				'x-powered-by': 'crm-constructor'
			} );
			res.send( JSON.stringify( { result: 'Success', error: null } ) );                                                              
    });                                              
    return app;
	}

	/**
	* Contains all the events of sockets.
	*/

	public socketServer(): void {
		const io = super.createSocketServer( this.app );
		io.on( 'connection', socket => {
			socket.on( 'my', ( data ) => {
				console.log( data );
			} );
			socket.emit( 'env', JSON.stringify( { DEVEL: this.devel } ) );
		} );
	}

	constructor() {
		super();
		this.app = this.router( this.application );
	}
}
