import Server from '../bin/server';
import * as request from 'supertest';
import * as openSocket from 'socket.io-client';


export default class ServerTest extends Server {

	public count: number;
	public pool: object;
	private readonly fileName: string = '<server.ts>';
	private readonly attemptCount: number = 5;

	constructor( count: number, pool: object ) {
		super();
		console.info( ` --- File ${ this.fileName } is being tested --- ` );
		this.count = count + 1;
		this.pool = pool;
		this.methodsWrapper();
	}

	private async methodsWrapper() {
		await this.routerTest();
		await this.socketServerTest();
	}

	private routerTest() {
		console.info( `${ this.fileName } : Testing route /test...` );
		request( this.app )
			.get( '/test' )
			.expect( 'Content-Type', /json/ )
			.expect( 'x-powered-by', /constructor/ )
			.expect( 'Content-Length', '33' )
			.expect( ServerTest.hasTestKeys )
			.expect( /Success/ )
			.expect( 200 )
			.end( ( err, res ) => {
				if ( err ) throw err;
			} );

	}

	private async socketServerTest() {
		const result = await new Promise( ( resolve, reject ) => {
			console.info( `${ this.fileName } : Testing socketServer...` );
			const url = `${ this.origin }:${ this.httpsPort }`;
			const socket = openSocket.connect( url, { 
				transports: ['websocket'], 
				rejectUnauthorized: false,
				timeout: 3000	
			} );
			socket.open();
			socket.on( 'connect', () => {
				socket.close();
				resolve( `Success test websocket connect server to ${ url }.` );
			} );
			socket.on( 'reconnect_attempt', ( attemptNumber ) => {
				if ( attemptNumber >= this.attemptCount ) {
					throw new Error( `wss request to  <${ url }> error: maximum number of server accesses exceeded: ${ this.attemptCount }` );
				}
			} );
		} )
		console.info( result );
		await this.next();
	}

	private next() {
		const pool = this.pool;
		if ( this.pool[ this.count ] ) this.pool[ this.count ]( this.count, pool );
	}

	private static hasTestKeys( res ) {
		if ( ! ( 'result' in res.body ) ) throw new Error( "missing result key" );
		if ( ! ( 'error' in res.body ) ) throw new Error( "missing error key" );
	}
}
