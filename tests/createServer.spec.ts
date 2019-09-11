import CreateServer from '../bin/createServer';
import * as assert from 'assert';


export default class ServerTest extends CreateServer {

	public count: number;
	public pool: object;
	private readonly fileName: string = '<createServer.ts>';

	constructor( count: number, pool: object ) {
		super();
		console.info( ` --- File ${ this.fileName } is being tested --- ` );
		this.count = count + 1;
		this.pool = pool;
		this.getSSLOptionsTest();
	}

	private next() {
		const pool = this.pool;
		if ( this.pool[ this.count ] ) this.pool[ this.count ]( this.count, pool );
	}

	private getSSLOptionsTest(): void {	
		console.info( `${ this.count } : Testing getSSLOptions method...` );
		assert.doesNotThrow( super.getSSLOptions.bind( this ) );
		this.next();
	}
}
